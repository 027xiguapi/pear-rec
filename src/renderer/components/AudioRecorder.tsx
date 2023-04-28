import React, { useRef } from "react";
import useMediaRecorder from "./useMediaRecorder";

const AudioRecorder = () => {
	const {
		mediaUrl,
		startRecord,
		resumeRecord,
		pauseRecord,
		stopRecord,
		clearBlobUrl,
		getAudioStream,
	} = useMediaRecorder({
		audio: true,
		onStop: (url: string) => alert(`录音完成，${url}`),
	});

	const previewAudio = useRef<HTMLAudioElement>(null);

	return (
		<div>
			<h2>录音</h2>
			<audio src={mediaUrl} controls />

			<audio ref={previewAudio} controls />

			<button
				onClick={() =>
					(previewAudio.current!.srcObject = getAudioStream() || null)
				}
			>
				预览
			</button>
			<button onClick={startRecord}>开始</button>
			<button onClick={pauseRecord}>暂停</button>
			<button onClick={resumeRecord}>恢复</button>
			<button onClick={stopRecord}>停止</button>
			<button onClick={clearBlobUrl}>清除 URL</button>
		</div>
	);
};

export default AudioRecorder;
