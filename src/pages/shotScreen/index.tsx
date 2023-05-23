import React, { useCallback, useEffect, useState } from "react";
import Screenshots, { Bounds } from "react-screenshots";
import { ipcRenderer } from "electron";
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
		return img;
	}

	const onSave = useCallback((blob: Blob, bounds: Bounds) => {
		const downloadUrl = URL.createObjectURL(blob);
		ipcRenderer.send("ss:download-img", downloadUrl);
	}, []);

	const onCancel = useCallback(() => {
		ipcRenderer.send("ss:close-win");
	}, []);

	const onOk = useCallback((blob: Blob, bounds: Bounds) => {
		const downloadUrl = URL.createObjectURL(blob);
		ipcRenderer.send("ss:save-img", downloadUrl);
	}, []);

	// function clipboardScreenShotImg(base64String: any) {
	// 	const image = nativeImage.createFromDataURL(base64String);
	// 	clipboard.writeImage(image);
	// 	ipcRenderer.send("ss:save-img", { base64String });
	// 	ipcRenderer.send("ss:close-win");
	// }

	// function blobToBase64(blob: any, callback: any) {
	// 	const reader = new FileReader();
	// 	reader.readAsDataURL(blob);
	// 	reader.onload = function (event) {
	// 		const base64String = event.target!.result;
	// 		callback(base64String);
	// 	};
	// }

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
