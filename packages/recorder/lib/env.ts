import webRTCAdapter_import from "webrtc-adapter";

const webRTCAdapter: typeof webRTCAdapter_import =
	//@ts-ignore
	webRTCAdapter_import.default || webRTCAdapter_import;

export const Env = new (class {
	readonly isIOS = ["iPad", "iPhone", "iPod"].includes(navigator.platform);
	readonly supportedBrowsers = ["firefox", "chrome", "safari"];

	readonly minFirefoxVersion = 59;
	readonly minChromeVersion = 72;
	readonly minSafariVersion = 605;

	isAudioContextSupported(): boolean {
		return typeof AudioContext !== "undefined";
	}

	isMediaDevicesSupported(): boolean {
		return typeof navigator.mediaDevices !== "undefined";
	}

	isGetUserMediaSupported(): boolean {
		return (
			this.isMediaDevicesSupported() &&
			typeof navigator.mediaDevices.getUserMedia !== "undefined"
		);
	}

	isMediaRecorderSupported(): boolean {
		return typeof MediaRecorder !== "undefined";
	}

	isAudioWorkletNode(): boolean {
		return typeof AudioWorkletNode !== "undefined";
	}

	isBrowserSupported(): boolean {
		const browser = this.getBrowser();
		const version = this.getVersion();

		const validBrowser = this.supportedBrowsers.includes(browser);

		if (!validBrowser) return false;

		if (browser === "chrome") return version >= this.minChromeVersion;
		if (browser === "firefox") return version >= this.minFirefoxVersion;
		if (browser === "safari")
			return !this.isIOS && version >= this.minSafariVersion;

		return false;
	}

	getBrowser(): string {
		return webRTCAdapter.browserDetails.browser;
	}

	getVersion(): number {
		return webRTCAdapter.browserDetails.version || 0;
	}

	isUnifiedPlanSupported(): boolean {
		const browser = this.getBrowser();
		const version = webRTCAdapter.browserDetails.version || 0;

		if (browser === "chrome" && version < this.minChromeVersion) return false;
		if (browser === "firefox" && version >= this.minFirefoxVersion) return true;
		if (
			!(
				this.isAudioContextSupported() &&
				this.isMediaDevicesSupported() &&
				this.isGetUserMediaSupported() &&
				this.isMediaRecorderSupported() &&
				this.isAudioWorkletNode()
			)
		)
			return false;

		return true;
	}

	toString(): string {
		return `Supports:
    browser:${this.getBrowser()}
    version:${this.getVersion()}
    isIOS:${this.isIOS}
    isAudioContextSupported:${this.isAudioContextSupported()}
	isMediaDevicesSupported:${this.isMediaDevicesSupported()}
	isGetUserMediaSupported:${this.isGetUserMediaSupported()}
	isMediaRecorderSupported:${this.isMediaRecorderSupported()}
    isBrowserSupported:${this.isBrowserSupported()}
	isAudioWorkletNode:${this.isAudioWorkletNode()}
    isUnifiedPlanSupported:${this.isUnifiedPlanSupported()}
	`;
	}
})();
