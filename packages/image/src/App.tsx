import { useState, useEffect } from "react";
import Image from "./Image";
import { useSearchParams } from "react-router-dom";
import { Button, Upload } from "antd";
import { saveAs } from "file-saver";
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
import "./App.css";

function App() {
	const [search, setSearch] = useSearchParams();
	const [isAlwaysOnTop, setIsAlwaysOnTop] = useState(false);
	const [imgSrc, setImgSrc] = useState("");
	const [isFull, setIsFull] = useState(false);

	useEffect(() => {
		getImgSrc();
	}, []);

	const props: UploadProps = {
		accept: "image/png,image/jpeg,.webp",
		name: "file",
		multiple: false,
		showUploadList: false,
		beforeUpload: (file) => {
			const imgUrl = window.URL.createObjectURL(file);
			setSearch({ url: imgUrl });
			setImgSrc(imgUrl);
			return false;
		},
	};

	function handleDownload() {
		const url = imgSrc;
		saveAs(url, url.split(`${location.origin}/`)[1] + ".png");
	}

	function handleReset() {
		(
			document.querySelector(".viewImage .rc-image-preview-img") as HTMLElement
		).style.transform = "";
	}

	function handlePrinter() {
		window.print();
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

	async function handleOpenImage() {
		// const imgs = await window.electronAPI?.invokeViGetImgs();
		// setImgs(imgs);
	}

	function handleToggleAlwaysOnTopWin() {
		const _isAlwaysOnTop = !isAlwaysOnTop;
		setIsAlwaysOnTop(_isAlwaysOnTop);
		// window.electronAPI?.invokeViSetAlwaysOnTop(_isAlwaysOnTop);
	}

	async function getImgSrc() {
		const imgUrl = search.get("url");
		if (imgUrl) {
			setImgSrc(imgUrl);
		} else {
			// const img = await window.electronAPI?.invokeViSetImg();
			// setImgSrc(img || defaultImg);
		}
	}

	return (
		<>
			<Image
				src={defaultImg}
				rootClassName="viewImageBox"
				preview={{
					icons: {
						rotateLeft: <RotateLeftOutlined rev={undefined} />,
						rotateRight: <RotateRightOutlined rev={undefined} />,
						zoomIn: <ZoomInOutlined rev={undefined} />,
						zoomOut: <ZoomOutOutlined rev={undefined} />,
						left: <LeftOutlined rev={undefined} />,
						right: <RightOutlined rev={undefined} />,
						flipX: <SwapOutlined rev={undefined} />,
						flipY: <SwapOutlined rev={undefined} rotate={90} />,
						openImg: (
							<Upload {...props}>
								<Button
									type="text"
									icon={<FileImageOutlined rev={undefined} />}
									className={`toolbarIcon`}
									title="打开图片"
								/>
							</Upload>
						),
						printer: (
							<PrinterOutlined rev={undefined} onClick={handlePrinter} />
						),
						download: (
							<DownloadOutlined rev={undefined} onClick={handleDownload} />
						),
						reset: <SyncOutlined rev={undefined} onClick={handleReset} />,
						fullScreen: isFull ? (
							<CompressOutlined
								rev={undefined}
								onClick={handleExitFullscreen}
							/>
						) : (
							<ExpandOutlined rev={undefined} onClick={handleFullScreen} />
						),
					},
					visible: true,
					getContainer: "#root .viewImage",
				}}
			/>
		</>
	);
}

export default App;
