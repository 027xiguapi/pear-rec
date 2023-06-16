import React, { useCallback, useEffect, useState } from "react";
import Screenshots, { Bounds } from "react-screenshots";
import { useNavigate } from "react-router-dom";
import { saveAs } from "file-saver";
import "react-screenshots/lib/style.css";
import styles from "./index.module.scss";
import defaultImg from "/imgs/th.webp";

export default function ShotScreen() {
	const navigate = useNavigate();
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
			: navigate("/home");
	}, []);

	const onOk = useCallback((blob: Blob, bounds: Bounds) => {
		const url = URL.createObjectURL(blob);
		if (window.electronAPI) {
			window.electronAPI.sendSsSaveImg(url);
		} else {
			copyImg(url);
			navigate(`/viewImage?url=${encodeURIComponent(url)}`);
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
