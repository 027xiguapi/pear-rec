import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { Button, Upload } from "antd";
import { saveAs } from "file-saver";
import Image from "@pear-rec/image";
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
import defaultImg from "@/assets/imgs/th.webp";
import "@pear-rec/image/dist/style.css";
import "./index.scss";

const { Dragger } = Upload;
const ViewImage = () => {
	const [search, setSearch] = useSearchParams();
	const [visible, setVisible] = useState(false);
	const [isAlwaysOnTop, setIsAlwaysOnTop] = useState(false);
	const [imgSrc, setImgSrc] = useState("");
	const [isFull, setIsFull] = useState(false);

	useEffect(() => {
		setVisible(true);
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
		const imgs = await window.electronAPI?.invokeViGetImgs();
		// setImgs(imgs);
	}

	function handleToggleAlwaysOnTopWin() {
		const _isAlwaysOnTop = !isAlwaysOnTop;
		setIsAlwaysOnTop(_isAlwaysOnTop);
		window.electronAPI?.invokeViSetAlwaysOnTop(_isAlwaysOnTop);
	}

	async function getImgSrc() {
		const img = await window.electronAPI?.invokeViSetImg();
		const imgUrl = search.get("url");
		setImgSrc(img || imgUrl || defaultImg);
		return img || imgUrl || defaultImg;
	}

	// async function setSsImg() {
	// 	const imgs = await window.electronAPI?.invokeViGetImgs();
	// 	// setImages(imgs);
	// }

	return (
		<div className="viewImage">
			{imgSrc ? (
				<Image
					src={imgSrc}
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
						visible,
						getContainer: "#root .viewImage",
					}}
				/>
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
