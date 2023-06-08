import React, { useCallback, useEffect, useState } from "react";
import Screenshots, { Bounds } from "react-screenshots";
import "react-screenshots/lib/style.css";
import styles from "./index.module.scss";

export default function ShotScreen() {
	const [screenShotImg, setScreenShotImg] = useState("");

	useEffect(() => {
		getShotScreenImg();
	}, []);

	async function getShotScreenImg() {
		const img = await window.electronAPI?.invokeSsGetShotScreenImg();
		setScreenShotImg(img);
		return img;
	}

	const onSave = useCallback((blob: Blob, bounds: Bounds) => {
		const url = URL.createObjectURL(blob);
		window.electronAPI?.sendSsDownloadImg(url);
	}, []);

	const onCancel = useCallback(() => {
		window.electronAPI?.sendSsCloseWin();
	}, []);

	const onOk = useCallback((blob: Blob, bounds: Bounds) => {
		const url = URL.createObjectURL(blob);
		window.electronAPI?.sendSsSaveImg(url);
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
