class SoundMeter {
	private context: AudioContext;
	private instant: number = 0.0;
	private slow: number = 0.0;
	private clip: number = 0.0;
	private script: ScriptProcessorNode;
	private mic: MediaStreamAudioSourceNode | null = null;

	constructor(context: AudioContext) {
		this.context = context;
		this.script = context.createScriptProcessor(2048, 1, 1);
		this.script.onaudioprocess = (event) => {
			const input = event.inputBuffer.getChannelData(0);
			let i;
			let sum = 0.0;
			let clipcount = 0;
			for (i = 0; i < input.length; ++i) {
				sum += input[i] * input[i];
				if (Math.abs(input[i]) > 0.99) {
					clipcount += 1;
				}
			}
			this.instant = Math.sqrt(sum / input.length);
			this.slow = 0.95 * this.slow + 0.05 * this.instant;
			this.clip = clipcount / input.length;
		};
	}

	getInstant() {
		return this.instant;
	}

	getSlow() {
		return this.slow;
	}

	getClip() {
		return this.clip;
	}

	connectToSource(stream: MediaStream) {
		try {
			this.mic = this.context.createMediaStreamSource(stream);
			this.mic.connect(this.script);
			this.script.connect(this.context.destination);
		} catch (e) {
			console.error(e);
		}
	}

	stop() {
		this.mic?.disconnect();
		this.script.disconnect();
	}
}

export { SoundMeter };

export default SoundMeter;
