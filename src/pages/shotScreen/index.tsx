import React, { useCallback, useEffect, useState } from "react";
import Screenshots, { Bounds } from "react-screenshots";
import { ipcRenderer, clipboard, nativeImage } from "electron";
// import url from "@/assets/imgs/1.jpg";
import "react-screenshots/lib/style.css";
import "./index.scss";

export default function ShotScreen() {
	const [screenShotImg, setScreenShotImg] = useState("");

	useEffect(() => {
		getShotScreenImg();
	}, []);

	async function getShotScreenImg() {
		const img = await ipcRenderer.invoke("ss:get-shot-screen-img");
		setScreenShotImg(img);
		console.log(img);
		return img;
	}

	const onSave = useCallback((blob: Blob, bounds: Bounds) => {
		blobToBase64(blob, (base64String: any) => {
			ipcRenderer.send("ss:save-image", { base64String });
		});
	}, []);

	const onCancel = useCallback(() => {
		ipcRenderer.send("ss:close-win");
	}, []);

	const onOk = useCallback((blob: Blob, bounds: Bounds) => {
		blobToBase64(blob, clipboardScreenShotImg);
	}, []);

	function clipboardScreenShotImg(screenShotImg: any) {
		const image = nativeImage.createFromDataURL(screenShotImg);
		clipboard.writeImage(image);
		ipcRenderer.send("ss:save-image", { base64String: screenShotImg });
		ipcRenderer.send("ss:close-win");
	}

	function blobToBase64(blob: any, callback: any) {
		const reader = new FileReader();
		reader.readAsDataURL(blob);
		reader.onload = function (event) {
			const base64String = event.target!.result;
			callback(base64String);
		};
	}

	return (
		<Screenshots
			url={screenShotImg}
			width={window.innerWidth}
			height={window.innerHeight}
			onSave={onSave}
			onCancel={onCancel}
			onOk={onOk}
		/>
	);
}
