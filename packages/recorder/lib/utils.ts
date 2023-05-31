async function _enumerateDevices() {
	try {
		const devices = await navigator.mediaDevices.enumerateDevices();
		return devices;
	} catch (err) {
		return err;
	}
}

function getSupportedMimeTypes(): string[] {
	// const media = this.mediaType === "audio" ? "audio" : "video";
	const media = "audio";
	const types = [
		"wav",
		"webm",
		"mp4",
		"ogg",
		"mov",
		"avi",
		"wmv",
		"flv",
		"mkv",
		"ts",
		"x-matroska",
		"mpeg",
	];
	const codecs = [
		"vp9",
		"vp9.0",
		"vp8",
		"vp8.0",
		"avc1",
		"av1",
		"h265",
		"h264",
	];
	const supported: string[] = [];
	const isSupported = MediaRecorder.isTypeSupported;
	types.forEach((type: string) => {
		const mimeType = `${media}/${type}`;
		codecs.forEach((codec: string) =>
			[
				`${mimeType};codecs=${codec}`,
				`${mimeType};codecs=${codec.toUpperCase()}`,
			].forEach((variation) => {
				if (isSupported(variation)) supported.push(variation);
			}),
		);
		if (isSupported(mimeType)) supported.push(mimeType);
	});
	return supported;
}

export { _enumerateDevices, getSupportedMimeTypes };
