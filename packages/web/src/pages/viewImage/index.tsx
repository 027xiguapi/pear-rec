import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { Button, Upload } from "antd";
import Viewer from "viewerjs";
import {
	FileImageOutlined,
	ZoomInOutlined,
	ZoomOutOutlined,
	RotateLeftOutlined,
	RotateRightOutlined,
	SyncOutlined,
	DownloadOutlined,
	PrinterOutlined,
	LeftOutlined,
	RightOutlined,
	SwapOutlined,
	ExpandOutlined,
	CompressOutlined,
	InboxOutlined,
	PushpinOutlined,
	EditOutlined,
	CloseOutlined,
} from "@ant-design/icons";
import type { UploadProps } from "antd/es/upload/interface";
import defaultImg from "/imgs/th.webp";
import "viewerjs/dist/viewer.css";
import styles from "./index.module.scss";

const { Dragger } = Upload;
const ViewImage = () => {
	const [search, setSearch] = useSearchParams();
	const [imgs, setImgs] = useState([]);
	const [isAlwaysOnTop, setIsAlwaysOnTop] = useState(false);
	const [isFull, setIsFull] = useState(false);

	useEffect(() => {
		initImgs();
	}, []);

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
					const a = document.createElement("a");

					a.href = viewer.image.src;
					a.download = viewer.image.alt;
					document.body.appendChild(a);
					a.click();
					document.body.removeChild(a);
				},
				print: () => {
					window.print();
				},
			},
		}) as any;
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

	async function handleOpenImage() {
		const imgs = await window.electronAPI?.invokeViGetImgs();
		// setImgs(imgs);
	}

	function handleToggleAlwaysOnTopWin() {
		const _isAlwaysOnTop = !isAlwaysOnTop;
		setIsAlwaysOnTop(_isAlwaysOnTop);
		window.electronAPI?.invokeViSetAlwaysOnTop(_isAlwaysOnTop);
	}

	async function initImgs() {
		const imgUrl = search.get("url");
		if (imgUrl) {
			setImgs([imgUrl]);
		} else {
			const img = (await window.electronAPI?.invokeViSetImg()) || defaultImg;
			setImgs([img]);
		}
	}

	return (
		<div className={styles.viewImgs} id="viewImgs">
			{imgs.length ? (
				imgs.map((img, key) => {
					return <img className="viewImg" src={img} key={key} />;
				})
			) : (
				<Dragger {...props} className="viewImageUpload">
					<p className="ant-upload-drag-icon">
						<InboxOutlined rev={undefined} />
					</p>
					<p className="ant-upload-text">点击或拖着图片</p>
					<p className="ant-upload-hint">
						支持.jpg、.jpeg、.jfif、.pjpeg、.pjp、.png、.apng、.webp、.avif、.bmp、.gif、.webp
					</p>
				</Dragger>
			)}
		</div>
	);
};

export default ViewImage;
