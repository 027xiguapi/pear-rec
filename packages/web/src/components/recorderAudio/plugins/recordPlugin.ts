/**
 * Record audio from the microphone with a real-time waveform preview
 */

import RecordPlugin, {
	type RecordPluginEvents,
	type RecordPluginOptions,
} from "wavesurfer.js/plugins/record";

export type RecordEvents = RecordPluginEvents & {
	"record-pause": [];
	"record-resume": [];
};

class Record extends RecordPlugin {
	// private mediaRecorder: MediaRecorder | null = null;
	/** Create an instance of the Record plugin */
	constructor(options: RecordPluginOptions) {
		super({
			...options,
			audioBitsPerSecond: options.audioBitsPerSecond,
		});
	}

	/** Create an instance of the Record plugin */
	public static create(options?: RecordPluginOptions) {
		return new Record(options || {});
	}
	public getMediaRecorder() {
		// @ts-ignore
		return this.mediaRecorder;
	}

	/** Pause the recording */
	public pauseRecording() {
		if (this.isRecording()) {
			this.getMediaRecorder()?.pause();
		}
	}

	/** Resume the recording */
	public resumeRecording() {
		if (this.isRecording()) {
			this.getMediaRecorder()?.resume();
		}
	}

	/** Get the duration */
	public getDuration(blob): Promise<number> {
		return new Promise((resolve, reject) => {
			const audioContext = new AudioContext();
			const reader = new FileReader();

			reader.onload = function () {
				const arrayBuffer = this.result as ArrayBuffer;
				audioContext.decodeAudioData(
					arrayBuffer,
					(buffer) => {
						const duration = Math.round(buffer.duration * 1000);
						resolve(duration);
					},
					(err) => {
						throw new Error("Error getDuration:" + (err as Error).message);
					},
				);
			};

			if (blob) {
				reader.readAsArrayBuffer(blob);
			} else {
				throw new Error("Error blob is empty ");
			}
		});
	}
}

export default Record;
