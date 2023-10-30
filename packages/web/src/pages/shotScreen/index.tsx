import React, { useCallback, useEffect, useState, useRef } from "react";
import { Button, Modal, message, Space } from "antd";
import { useTranslation } from "react-i18next";
import Screenshots, { Bounds } from "@pear-rec/screenshot";
import UploadImg from "../../components/upload/UploadImg";
import { saveAs } from "file-saver";
import ininitApp from "../../pages/main";
import { useUserApi } from "../../api/user";
import { searchImg } from "../../util/searchImg";
import { isURL } from "../../util/validate";
import { useApi } from "../../api";
import "@pear-rec/screenshot/src/Screenshots/screenshots.scss";
import styles from "./index.module.scss";

const defaultImg = "/imgs/th.webp";
function ShotScreen() {
	const { t } = useTranslation();
	const api = useApi();
	const userApi = useUserApi();
	const userRef = useRef({} as any);
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
		window.isOffline || userRef.current.id || getCurrentUser();
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
					setScreenShotImg(canvas.toDataURL("image/png"));
					stream.getTracks().forEach((track) => track.stop());
				});
			})
			.catch((error) => {
				console.error("Error accessing screen:", error);
			});
	}

	const onSave = useCallback((blob: Blob, bounds: Bounds) => {
		const url = URL.createObjectURL(blob);
		saveAs(url, url.split(`${location.origin}/`)[1] + ".png");
	}, []);

	const onCancel = useCallback(() => {
		if (window.isElectron) {
			window.electronAPI.sendSsCloseWin();
			window.electronAPI.sendMaOpenWin();
		} else {
			location.href = `/index.html`;
		}
	}, []);

	const onScan = useCallback((result) => {
		Modal.confirm({
			title: "扫码结果",
			content: result,
			okText: t("modal.ok"),
			cancelText: t("modal.cancel"),
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
		const url = URL.createObjectURL(blob);
		window.isOffline
			? saveAs(url, `pear-rec_${+new Date()}.png`)
			: saveFile(blob);
	}, []);

	async function saveFile(blob) {
		try {
			const formData = new FormData();
			formData.append("type", "ss");
			formData.append("userUuid", userRef.current.uuid);
			formData.append("file", blob);
			const res = (await api.saveFile(formData)) as any;
			if (res.code == 0) {
				if (window.isElectron) {
					window.electronAPI?.sendSsCloseWin();
					window.electronAPI?.sendViOpenWin({ imgUrl: res.data.filePath });
				} else {
					Modal.confirm({
						title: "图片已保存，是否查看？",
						content: res.data.filePath,
						okText: t("modal.ok"),
						cancelText: t("modal.cancel"),
						onOk() {
							location.href = `/viewImage.html?imgUrl=${res.data.filePath}`;
						},
					});
				}
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

	function handleUploadImg(files) {
		const selectedFile = files[0];
		setScreenShotImg(window.URL.createObjectURL(selectedFile));
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
			) : window.isElectron ? (
				<></>
			) : (
				<Space wrap className="btns">
					<UploadImg handleUploadImg={handleUploadImg} />
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
