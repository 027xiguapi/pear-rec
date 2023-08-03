import { useEffect, useState, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Button, Upload } from "antd";
import Viewer from "viewerjs";
import { InboxOutlined } from "@ant-design/icons";
import type { UploadProps } from "antd/es/upload/interface";

import "viewerjs/dist/viewer.css";
import styles from "./index.module.scss";

const defaultImg = "./imgs/th.webp";
const { Dragger } = Upload;
const ViewImage = () => {
	const navigate = useNavigate();
	let refViewer = useRef<any>();
	const [search, setSearch] = useSearchParams();
	const [imgs, setImgs] = useState([]);
	const [initialViewIndex, setInitialViewIndex] = useState(0);
	const [isFull, setIsFull] = useState(false);

	useEffect(() => {
		initImgs();
		handleDrop();
		return destroyViewer;
	}, []);

	function destroyViewer() {
		refViewer.current?.destroy();
	}

	useEffect(() => {
		imgs.length && initViewer();
	}, [imgs]);

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
				zoomIn: 1,
				zoomOut: 1,
				oneToOne: 1,
				reset: 1,
				prev: 1,
				// play: {
				// 	show: 4,
				// 	size: "large",
				// },
				next: 1,
				rotateLeft: 1,
				rotateRight: 1,
				flipHorizontal: 1,
				flipVertical: 1,
				download: () => {
					handleDownload(viewer);
				},
				print: () => {
					window.print();
				},
				edit: () => {
					const imgUrl = imgs[initialViewIndex]?.url;
					if (window.electronAPI) {
						window.electronAPI.sendEiOpenWin({ imgUrl });
					} else {
						viewer.destroy();
						navigate(`/editImage?imgUrl=${imgUrl}`);
					}
				},
			},
		}) as any;
		refViewer.current = viewer;
	}

	const props: UploadProps = {
		accept: "image/png,image/jpeg,.webp",
		name: "file",
		multiple: false,
		showUploadList: false,
		beforeUpload: (file) => {
			const imgUrl = window.URL.createObjectURL(file);
			setSearch({ url: imgUrl });
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
			refViewer.current?.destroy();
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
		const imgUrl = search.get("imgUrl");
		if (imgUrl) {
			if (window.electronAPI) {
				await window.electronAPI?.sendViSetHistoryImg(imgUrl);
				const { imgs, currentIndex } =
					await window.electronAPI?.invokeViGetImgs(imgUrl);

				setInitialViewIndex(currentIndex);
				setImgs(imgs);
			} else {
				setImgs([{ url: imgUrl, index: 0 }]);
			}
		} else {
			setImgs([{ url: defaultImg, index: 0 }]);
		}
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
					<p className="ant-upload-text">点击或拖着图片</p>
					<p className="ant-upload-hint">
						支持.jpg、.jpeg、.jfif、.pjpeg、.pjp、.png、.apng、.webp、.avif、.bmp、.gif、.webp、.ico
					</p>
				</Dragger>
			)}
		</div>
	);
};

export default ViewImage;
