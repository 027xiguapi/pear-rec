const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d', { desynchronized: true });
const startRecordingButton = document.querySelector('#start-recording');
const endRecordingButton = document.querySelector('#end-recording');
const recordingStatus = document.querySelector('#recording-status');

/** RECORDING & MUXING STUFF */

let muxer = null;
let videoEncoder = null;
let audioEncoder = null;
let startTime = null;
let recording = false;
let audioTrack = null;
let intervalId = null;
let lastKeyFrame = null;
let framesGenerated = 0;

const startRecording = async () => {
	// Check for VideoEncoder availability
	if (typeof VideoEncoder === 'undefined') {
		alert("Looks like your user agent doesn't support VideoEncoder / WebCodecs API yet.");
		return;
	}

	startRecordingButton.style.display = 'none';

	// Check for AudioEncoder availability
	if (typeof AudioEncoder !== 'undefined') {
		// Try to get access to the user's microphone
		try {
			let userMedia = await navigator.mediaDevices.getUserMedia({ video: false, audio: true });
			audioTrack = userMedia.getAudioTracks()[0];
		} catch (e) {}
		if (!audioTrack) console.warn("Couldn't acquire a user media audio track.");
	} else {
		console.warn('AudioEncoder not available; no need to acquire a user media audio track.');
	}

	endRecordingButton.style.display = 'block';

	let audioSampleRate = audioTrack?.getCapabilities().sampleRate.max;

	// Create an MP4 muxer with a video track and maybe an audio track
	muxer = new Mp4Muxer.Muxer({
		target: new Mp4Muxer.ArrayBufferTarget(),

		video: {
			codec: 'avc',
			width: canvas.width,
			height: canvas.height
		},
		audio: audioTrack ? {
			codec: 'aac',
			sampleRate: audioSampleRate,
			numberOfChannels: 1
		} : undefined,

		// Puts metadata to the start of the file. Since we're using ArrayBufferTarget anyway, this makes no difference
		// to memory footprint.
		fastStart: 'in-memory',

		// Because we're directly pumping a MediaStreamTrack's data into it, which doesn't start at timestamp = 0
		firstTimestampBehavior: 'offset'
	});

	videoEncoder = new VideoEncoder({
		output: (chunk, meta) => muxer.addVideoChunk(chunk, meta),
		error: e => console.error(e)
	});
	videoEncoder.configure({
		codec: 'avc1.42001f',
		width: canvas.width,
		height: canvas.height,
		bitrate: 1e6
	});

	if (audioTrack) {
		audioEncoder = new AudioEncoder({
			output: (chunk, meta) => muxer.addAudioChunk(chunk, meta),
			error: e => console.error(e)
		});
		audioEncoder.configure({
			codec: 'mp4a.40.2',
			numberOfChannels: 1,
			sampleRate: audioSampleRate,
			bitrate: 128000
		});

		// Create a MediaStreamTrackProcessor to get AudioData chunks from the audio track
		let trackProcessor = new MediaStreamTrackProcessor({ track: audioTrack });
		let consumer = new WritableStream({
			write(audioData) {
				if (!recording) return;
				audioEncoder.encode(audioData);
				audioData.close();
			}
		});
		trackProcessor.readable.pipeTo(consumer);
	}

	startTime = document.timeline.currentTime;
	recording = true;
	lastKeyFrame = -Infinity;
	framesGenerated = 0;

	encodeVideoFrame();
	intervalId = setInterval(encodeVideoFrame, 1000/30);
};
startRecordingButton.addEventListener('click', startRecording);


const encodeVideoFrame = () => {
	let elapsedTime = document.timeline.currentTime - startTime;
	let frame = new VideoFrame(canvas, {
		timestamp: framesGenerated * 1e6 / 30 // Ensure equally-spaced frames every 1/30th of a second
	});
	framesGenerated++;

	// Ensure a video key frame at least every 10 seconds for good scrubbing
	let needsKeyFrame = elapsedTime - lastKeyFrame >= 10000;
	if (needsKeyFrame) lastKeyFrame = elapsedTime;

	videoEncoder.encode(frame, { keyFrame: needsKeyFrame });
	frame.close();

	recordingStatus.textContent =
		`${elapsedTime % 1000 < 500 ? '🔴' : '⚫'} Recording - ${(elapsedTime / 1000).toFixed(1)} s`;
};

const endRecording = async () => {
	endRecordingButton.style.display = 'none';
	recordingStatus.textContent = '';
	recording = false;

	clearInterval(intervalId);
	audioTrack?.stop();

	await videoEncoder?.flush();
	await audioEncoder?.flush();
	muxer.finalize();

	let buffer = muxer.target.buffer;
	downloadBlob(new Blob([buffer]));

	videoEncoder = null;
	audioEncoder = null;
	muxer = null;
	startTime = null;
	firstAudioTimestamp = null;

	startRecordingButton.style.display = 'block';
};
endRecordingButton.addEventListener('click', endRecording);

const downloadBlob = (blob) => {
	let url = window.URL.createObjectURL(blob);
	let a = document.createElement('a');
	a.style.display = 'none';
	a.href = url;
	a.download = `pear-rec_${+new Date()}.mp4`;
	document.body.appendChild(a);
	a.click();
	window.URL.revokeObjectURL(url);
};

/** CANVAS DRAWING STUFF */

ctx.fillStyle = 'white';
ctx.fillRect(0, 0, canvas.width, canvas.height);

let drawing = false;
let lastPos = { x: 0, y: 0 };

const getRelativeMousePos = (e) => {
	let rect = canvas.getBoundingClientRect();
	return { x: e.clientX - rect.x, y: e.clientY - rect.y };
};

const drawLine = (from, to) => {
	ctx.beginPath();
	ctx.moveTo(from.x, from.y);
	ctx.lineTo(to.x, to.y);
	ctx.strokeStyle = 'black';
	ctx.lineWidth = 3;
	ctx.lineCap = 'round';
	ctx.stroke();
};

canvas.addEventListener('pointerdown', (e) => {
	if (e.button !== 0) return;

	drawing = true;
	lastPos = getRelativeMousePos(e);
	drawLine(lastPos, lastPos);
});
window.addEventListener('pointerup', () => {
	drawing = false;
});
window.addEventListener('mousemove', (e) => {
	if (!drawing) return;

	let newPos = getRelativeMousePos(e);
	drawLine(lastPos, newPos);
	lastPos = newPos;
});
