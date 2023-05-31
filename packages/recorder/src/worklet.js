class SoundMeterWorklet extends AudioWorkletProcessor {
	instant;
	slow;
	clip;
	constructor() {
		super();
		this.instant = 0.0;
		this.slow = 0.0;
		this.clip = 0.0;
	}

	process(inputs, outputs, parameters) {
		console.log("inputs", inputs);
		console.log("outputs", outputs);
		console.log("parameters", parameters);
		const input = inputs[0][0];
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
		return true;
	}
}

registerProcessor("sound-meter-processor", SoundMeterWorklet);
