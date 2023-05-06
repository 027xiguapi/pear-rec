import React, { useEffect, useState } from "react";
import ScreenShot from "js-web-screen-shot";
import { IpcEvents } from "@/ipcEvents";
import { ipcRenderer } from "electron";
import "./index.scss";

async function getDesktopCapturerSource() {
	return await ipcRenderer.invoke("ss:get-desktop-capturer-source");
}

async function getInitStream(
	source: { id: string },
	audio?: boolean,
): Promise<MediaStream | null> {
	return new Promise((resolve, _reject) => {
		(navigator.mediaDevices as any)
			.getUserMedia({
				audio: audio
					? {
							mandatory: {
								chromeMediaSource: "desktop",
							},
					  }
					: false,
				video: {
					mandatory: {
						chromeMediaSource: "desktop",
						chromeMediaSourceId: source.id,
					},
				},
			})
			.then((stream: MediaStream) => {
				resolve(stream);
			})
			.catch((error: any) => {
				console.log(error);
				resolve(null);
			});
	});
}

const ShotScreen = () => {
	const [screenShotImg, setScreenShotImg] = useState("");
	let isShoting = false;

	useEffect(() => {
		doScreenShot();
	}, []);

	useEffect(() => {
		screenShotImg && clipboardScreenShotImg();
		screenShotImg && closeScreenShot();
	}, [screenShotImg]);

	async function doScreenShot() {
		if (isShoting) return;
		isShoting = true;
		const sources = await getDesktopCapturerSource();
		const stream = await getInitStream(
			sources.filter((e: any) => e.id == "screen:0:0")[0],
		);

		new ScreenShot({
			enableWebRtc: true,
			screenFlow: stream!,
			level: 999,
			completeCallback: (screenShotImg: string) => {
				completeScreenShot(screenShotImg);
			},
			closeCallback: () => {
				closeScreenShot();
			},
		});
	}

	function completeScreenShot(screenShotImg: any) {
		setScreenShotImg(screenShotImg);
	}

	function closeScreenShot() {
		isShoting = false;
		ipcRenderer.send("ss:close-win");
	}

	function clipboardScreenShotImg() {
		window.electronAPI?.setClipboardImg(screenShotImg);
	}

	return <div className="shotScreen"></div>;
};

export default ShotScreen;
