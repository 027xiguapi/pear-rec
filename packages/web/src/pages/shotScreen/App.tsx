import React, { useCallback, useEffect, useState } from "react";
import Screenshots, { Bounds } from "@pear-rec/screenshot";
import { saveAs } from "file-saver";
import "@pear-rec/screenshot/lib/style.css";
import styles from "./App.module.scss";

const defaultImg = "/imgs/th.webp";
export default function ShotScreen() {
	const [screenShotImg, setScreenShotImg] = useState("");

	useEffect(() => {
		getShotScreenImg();
	}, []);

	async function getShotScreenImg() {
		const img = await window.electronAPI?.invokeSsGetShotScreenImg();
		setScreenShotImg(img || defaultImg);
	}

	const onSave = useCallback((blob: Blob, bounds: Bounds) => {
		const url = URL.createObjectURL(blob);
		window.electronAPI
			? window.electronAPI.sendSsDownloadImg(url)
			: saveAs(url, url.split(`${location.origin}/`)[1] + ".png");
	}, []);

	const onCancel = useCallback(() => {
		window.electronAPI
			? window.electronAPI.sendSsCloseWin()
			: (location.href = `/index.html`);
	}, []);

	const onOk = useCallback((blob: Blob, bounds: Bounds) => {
		const imgUrl = URL.createObjectURL(blob);
		if (window.electronAPI) {
			window.electronAPI.sendSsSaveImg(imgUrl);
		} else {
			copyImg(imgUrl);
			window.open(`/viewImage.html?imgUrl=${encodeURIComponent(imgUrl)}`);
		}
	}, []);

	async function copyImg(url) {
		const data = await fetch(url);
		const blob = await data.blob();

		await navigator.clipboard.write([
			new ClipboardItem({
				[blob.type]: blob,
			}),
		]);
	}

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
