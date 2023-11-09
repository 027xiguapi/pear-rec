import { useEffect, useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Modal, Upload } from "antd";
import Viewer from "viewerjs";
import QrScanner from "qr-scanner";
import { InboxOutlined } from "@ant-design/icons";
import type { UploadProps } from "antd/es/upload/interface";
import { isURL } from "../../util/validate";
import { urlToBlob } from "../../util/file";
import { searchImg } from "../../util/searchImg";
import ininitApp from "../../pages/main";
import { useApi } from "../../api";
import { useUserApi } from "../../api/user";
import "viewerjs/dist/viewer.css";
import styles from "./index.module.scss";

const defaultImg = "./imgs/th.webp";
const { Dragger } = Upload;
const ViewImage = () => {
	const { t } = useTranslation();
	const api = useApi();
	const userApi = useUserApi();
	let viewerRef = useRef<any>();
	const inputRef = useRef(null);
	const [user, setUser] = useState<any>({});
	const [imgs, setImgs] = useState([]);
	const [initialViewIndex, setInitialViewIndex] = useState(0);
	const [isFull, setIsFull] = useState(false);

	useEffect(() => {
		window.isOffline || user.id || getCurrentUser();
		handleDrop();
		initImgs();
		return destroyViewer;
	}, []);

	useEffect(() => {
		imgs.length && initViewer();
	}, [imgs]);

	async function getCurrentUser() {
		try {
			const res = (await userApi.getCurrentUser()) as any;
			if (res.code == 0) {
				setUser(res.data);
			}
		} catch (err) {
			console.log(err);
		}
	}

	function destroyViewer() {
		viewerRef.current?.destroy();
	}

	function initViewer() {
		const imgList = document.getElementById("viewImgs") as any;
		const viewer = new Viewer(imgList, {
			// 0: 不显示
			// 1：显示
			// 2：width>768px
			// 3: width>992px
			// 4: width>1200px
			inline: true,
			initialViewIndex: initialViewIndex,
			className: "viewImgs",
			toolbar: {
				alwaysOnTopWin: handleToggleAlwaysOnTopWin,
				file: () => {
					inputRef.current.click();
				},
				scan: async () => {
					try {
						const imgUrl = imgs[initialViewIndex]?.url;
						const result = await QrScanner.scanImage(imgUrl);
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
					} catch (error) {
						console.error("scan Error:", error);
					}
				},
				search: async () => {
					const imgUrl = imgs[initialViewIndex]?.url;
					const blob = await urlToBlob(imgUrl);
					const tabUrl = await searchImg(blob, user.isProxy);
					if (window.electronAPI) {
						tabUrl && window.electronAPI.sendSsOpenExternal(tabUrl);
						window.electronAPI.sendSsCloseWin();
					} else {
						tabUrl && window.open(tabUrl);
					}
				},
				zoomIn: 1,
				zoomOut: 1,
				oneToOne: 1,
				reset: 1,
				prev: 1,
				next: 1,
				rotateLeft: 1,
				rotateRight: 1,
				flipHorizontal: 1,
				flipVertical: 1,
				// download: () => {
				// 	handleDownload(viewer);
				// },
				print: () => {
					window.print();
				},
				edit: () => {
					const imgUrl = imgs[initialViewIndex]?.url;
					if (window.electronAPI) {
						window.electronAPI.sendEiOpenWin({ imgUrl });
					} else {
						viewer.destroy();
						window.open(`/editImage.html?imgUrl=${imgUrl}`);
					}
				},
			},
		}) as any;
		viewerRef.current = viewer;
	}

	const props: UploadProps = {
		accept: "image/png,image/jpeg,.webp",
		name: "file",
		multiple: false,
		showUploadList: false,
		beforeUpload: (file) => {
			const imgUrl = window.URL.createObjectURL(file);
			window.open(`/viewImage.html?imgUrl=${imgUrl}`);
			setImgs([imgUrl]);
			return false;
		},
	};

	function handleDownload(viewer) {
		if (window.electronAPI) {
			window.electronAPI.sendViDownloadImg({
				url: viewer.image.src,
				name: viewer.image.alt,
			});
		} else {
			const a = document.createElement("a");

			a.href = viewer.image.src;
			a.download = viewer.image.alt;
			document.body.appendChild(a);
			a.click();
			document.body.removeChild(a);
		}
	}

	function handleFullScreen() {
		const element = document.querySelector("#root");
		if (element.requestFullscreen) {
			element.requestFullscreen();
			setIsFull(true);
		}
	}

	function handleExitFullscreen() {
		if (document.exitFullscreen) {
			document.exitFullscreen();
			setIsFull(false);
		}
	}

	function handleDrop() {
		document.addEventListener("drop", (e) => {
			e.preventDefault();
			e.stopPropagation();

			let imgs = [];
			let index = 0;
			for (const file of e.dataTransfer.files) {
				imgs.push({ url: window.URL.createObjectURL(file), index });
				index++;
			}
			viewerRef.current?.destroy();
			setImgs(imgs);
		});
		document.addEventListener("dragover", (e) => {
			e.preventDefault();
			e.stopPropagation();
		});
	}

	async function handleToggleAlwaysOnTopWin() {
		const isAlwaysOnTop = await window.electronAPI?.invokeViSetIsAlwaysOnTop();
		const icon = document.querySelector(".viewer-always-on-top-win");
		isAlwaysOnTop
			? icon.classList.add("current")
			: icon.classList.remove("current");
	}

	async function initImgs() {
		const paramsString = location.search;
		const searchParams = new URLSearchParams(paramsString);
		const imgUrl = searchParams.get("imgUrl") || user.historyImg;
		if (imgUrl) {
			if (imgUrl.substring(0, 4) == "blob") {
				setImgs([{ url: imgUrl, index: 0 }]);
			} else {
				const res = (await api.getImgs(imgUrl)) as any;
				if (res.code == 0) {
					setImgs(res.data.imgs);
					setInitialViewIndex(res.data.currentIndex);
				} else {
					setImgs([{ url: imgUrl, index: 0 }]);
				}
			}
		} else {
			setImgs([{ url: defaultImg, index: 0 }]);
		}
	}

	function handleImgUpload(event) {
		const selectedFile = event.target.files[0];
		const url = window.URL.createObjectURL(selectedFile);
		viewerRef.current?.destroy();
		setImgs([...imgs, { url: url, index: imgs.length }]);
		setInitialViewIndex(imgs.length);
	}

	return (
		<div className={styles.viewImgs} id="viewImgs">
			{imgs.length ? (
				imgs.map((img, key) => {
					return <img className="viewImg" src={img.url} key={key} />;
				})
			) : (
				<Dragger {...props} className="viewImageUpload">
					<p className="ant-upload-drag-icon">
						<InboxOutlined rev={undefined} />
					</p>
					<p className="ant-upload-text">{t("viewImage.uploadText")}</p>
					<p className="ant-upload-hint">{t("viewImage.uploadHint")}</p>
				</Dragger>
			)}
			<input
				accept="image/png,image/jpeg,.webp"
				type="file"
				className="inputRef"
				ref={inputRef}
				onChange={handleImgUpload}
			/>
		</div>
	);
};

ininitApp(ViewImage);
export default ViewImage;
