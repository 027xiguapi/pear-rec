import React, { useCallback, useEffect, useState, useRef } from "react";
import { Button, Modal } from "antd";
import Screenshots, { Bounds } from "@pear-rec/screenshot";
import { saveAs } from "file-saver";
import ininitApp from "../../pages/main";
import { searchImg } from "../../util/searchImg";
import { isURL } from "../../util/validate";
import "@pear-rec/screenshot/src/Screenshots/screenshots.scss";
import styles from "./index.module.scss";

const defaultImg = "/imgs/th.webp";
function ShotScreen() {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [screenShotImg, setScreenShotImg] = useState("");
	const [scanCode, setScanCode] = useState("");

	useEffect(() => {
		getShotScreenImg();
	}, []);

	const handleOk = () => {
		setIsModalOpen(false);
	};

	const handleCancel = () => {
		setIsModalOpen(false);
	};

	async function getShotScreenImg() {
		if (window.electronAPI) {
			const img = await window.electronAPI?.invokeSsGetShotScreenImg();
			setScreenShotImg(img || defaultImg);
		} else {
			navigator.mediaDevices
				.getDisplayMedia({ video: true })
				.then((stream) => {
					const canvas = document.createElement("canvas");
					canvas.width = window.innerWidth;
					canvas.height = window.innerHeight;

					const videoElement = document.createElement("video");
					videoElement.srcObject = stream;
					videoElement.play();

					videoElement.addEventListener("loadedmetadata", () => {
						const context = canvas.getContext("2d");
						context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

						// 导出绘制内容为图像
						setScreenShotImg(canvas.toDataURL("image/png"));

						// 停止屏幕捕获
						stream.getTracks().forEach((track) => track.stop());
					});
				})
				.catch((error) => {
					console.error("Error accessing screen:", error);
				});
		}
	}

	const onSave = useCallback((blob: Blob, bounds: Bounds) => {
		const url = URL.createObjectURL(blob);
		window.electronAPI
			? window.electronAPI.sendSsDownloadImg(url)
			: saveAs(url, url.split(`${location.origin}/`)[1] + ".png");
	}, []);

	const onCancel = useCallback(() => {
		// window.electronAPI
		// 	? window.electronAPI.sendSsCloseWin()
		// 	: (location.href = `/index.html`);
	}, []);

	const onScan = useCallback((result) => {
		if (isURL(result)) {
			window.electronAPI
				? window.electronAPI.sendSsOpenExternal(result)
				: window.open(result);
		} else {
			setScanCode(result);
			setIsModalOpen(true);
		}
	}, []);

	const onSearch = useCallback(async (blob) => {
		if (window.electronAPI) {
			// const tabUrl = await searchGoogleLens(blob);
			const tabUrl = await searchImg(blob);
			window.electronAPI.sendSsOpenExternal(tabUrl);
			window.electronAPI.sendSsCloseWin();
		}
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
				onSearch={onSearch}
				onScan={onScan}
			/>
			<Modal
				title="扫码结果"
				open={isModalOpen}
				onOk={handleOk}
				onCancel={handleCancel}
				okText="确认"
				cancelText="取消"
			>
				<p>{scanCode}</p>
			</Modal>
		</div>
	);
}

ininitApp(ShotScreen);

export default ShotScreen;
