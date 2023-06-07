import React, { useCallback, useEffect, useState } from "react";
import Screenshots, { Bounds } from "react-screenshots";
import { ipcRenderer } from "electron";
import "react-screenshots/lib/style.css";
import styles from "./index.module.scss";

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

	return (
		<div className={styles.shotScreen}>
			<Screenshots
				url={screenShotImg}
				width={window.innerWidth}
				height={window.innerHeight}
				onSave={onSave}
				onCancel={onCancel}
				onOk={onOk}
			/>
		</div>
	);
}
