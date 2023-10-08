import React, { useCallback, useEffect, useState, useRef } from "react";
import { Button, Modal, message, Space } from "antd";
import Screenshots, { Bounds } from "@pear-rec/screenshot";
import { saveAs } from "file-saver";
import ininitApp from "../../pages/main";
import { useUserApi } from "../../api/user";
import { searchImg } from "../../util/searchImg";
import { isURL } from "../../util/validate";
import { useApi } from "../../api";
import "@pear-rec/screenshot/src/Screenshots/screenshots.scss";
import styles from "./index.module.scss";
import { init } from "i18next";

const defaultImg = "/imgs/th.webp";
function ShotScreen() {
	const api = useApi();
	const userApi = useUserApi();
	const userRef = useRef({} as any);
	const inputRef = useRef(null);
	const [screenShotImg, setScreenShotImg] = useState("");

	useEffect(() => {
		init();
	}, []);

	async function getCurrentUser() {
		try {
			const res = (await userApi.getCurrentUser()) as any;
			if (res.code == 0) {
				userRef.current = res.data;
			}
		} catch (err) {
			console.log(err);
		}
	}

	async function init() {
		getCurrentUser();
		if (window.electronAPI) {
			const img = await window.electronAPI?.invokeSsGetShotScreenImg();
			setScreenShotImg(img || defaultImg);
		}
	}

	async function getShotScreenImg() {
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

	const onScan = useCallback((result) => {
		Modal.confirm({
			title: "扫码结果",
			content: result,
			onOk() {
				if (isURL(result)) {
					window.electronAPI
						? window.electronAPI.sendSsOpenExternal(result)
						: window.open(result);
				}
			},
			onCancel() {
				console.log("Cancel");
			},
		});
	}, []);

	const onSearch = useCallback(async (blob) => {
		const tabUrl = await searchImg(blob, userRef.current.isProxy);
		if (window.electronAPI) {
			tabUrl && window.electronAPI.sendSsOpenExternal(tabUrl);
			window.electronAPI.sendSsCloseWin();
		} else {
			tabUrl && window.open(tabUrl);
		}
	}, []);

	const onOk = useCallback((blob: Blob, bounds: Bounds) => {
		saveFile(blob);
	}, []);

	async function saveFile(blob) {
		try {
			const formData = new FormData();
			formData.append("type", "ss");
			formData.append("userUuid", userRef.current.uuid);
			formData.append("file", blob);
			const res = (await api.saveFile(formData)) as any;
			if (res.code == 0) {
				Modal.confirm({
					title: "图片已保存，是否查看？",
					content: res.data.filePath,
					onOk() {
						window.open(`/viewImage.html?imgUrl=${res.data.filePath}`);
						console.log("OK");
					},
					onCancel() {
						console.log("Cancel");
					},
				});
			}
		} catch (err) {
			message.error("保存失败");
		}
	}

	async function copyImg(url) {
		const data = await fetch(url);
		const blob = await data.blob();

		await navigator.clipboard.write([
			new ClipboardItem({
				[blob.type]: blob,
			}),
		]);
	}

	function handleImgUpload(event) {
		const selectedFile = event.target.files[0];
		setScreenShotImg(window.URL.createObjectURL(selectedFile));
	}

	function getImgUpload() {
		inputRef.current.click();
	}

	return (
		<div className={styles.shotScreen}>
			{screenShotImg ? (
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
			) : (
				<Space wrap className="btns">
					<Button type="primary" onClick={getImgUpload}>
						图片
					</Button>
					<input
						type="file"
						className="inputRef"
						ref={inputRef}
						onChange={handleImgUpload}
					/>
					<Button type="primary" onClick={getShotScreenImg}>
						屏幕
					</Button>
				</Space>
			)}
		</div>
	);
}

ininitApp(ShotScreen);

export default ShotScreen;
