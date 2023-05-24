import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { ipcRenderer } from "electron";
import { Button, Empty } from "antd";
import Image from "@/components/Image";
import {
	FileImageOutlined,
	ZoomInOutlined,
	ZoomOutOutlined,
	RotateLeftOutlined,
	RotateRightOutlined,
	SyncOutlined,
	DownloadOutlined,
	PrinterOutlined,
	EditOutlined,
	CloseOutlined,
	LeftOutlined,
	RightOutlined,
	SwapOutlined,
	PushpinOutlined,
} from "@ant-design/icons";
import "./index.scss";

const ViewImage = () => {
	const [search, setSearch] = useSearchParams();
	const [visible, setVisible] = useState(false);
	const [isAlwaysOnTop, setIsAlwaysOnTop] = useState(false);
	// const [images, setImages] = useState<any>([]);
	const [imgSrc, setImgSrc] = useState("");

	useEffect(() => {
		setVisible(true);
		search.get("history") ? setHistoryImg() : setSsImg();
	}, []);

	function handleDownload() {}

	function handleEdit() {}

	function handlePrinter() {}

	async function handleOpenImage() {
		const images = await ipcRenderer.invoke("vi:get-images", "选择图片");
		// setImages(images);
	}

	function handleToggleAlwaysOnTopWin() {
		const _isAlwaysOnTop = !isAlwaysOnTop;
		setIsAlwaysOnTop(_isAlwaysOnTop);
		ipcRenderer.send("vi:set-always-on-top", _isAlwaysOnTop);
	}

	async function setHistoryImg() {
		const img = await ipcRenderer.invoke("vi:set-img");
		if (img) {
			setImgSrc(img);
			// const images = [{ src: img, key: 0 }];
			// setImages(images);
		}
	}

	async function setSsImg() {
		const imgs = await ipcRenderer.invoke("vi:set-imgs");
		// setImages(imgs);
	}

	return (
		<div className="viewImage">
			{imgSrc ? (
				<>
					<div className="viewImageTools">
						<Button
							type="text"
							icon={<PushpinOutlined />}
							className={`toolbarIcon ${isAlwaysOnTop ? "active" : ""}`}
							title="置顶"
							onClick={() => handleToggleAlwaysOnTopWin()}
						/>
					</div>
					<Image
						src={imgSrc}
						rootClassName="viewImageBox"
						preview={{
							icons: {
								rotateLeft: <RotateLeftOutlined />,
								rotateRight: <RotateRightOutlined />,
								zoomIn: <ZoomInOutlined />,
								zoomOut: <ZoomOutOutlined />,
								left: <LeftOutlined />,
								right: <RightOutlined />,
								flipX: <SwapOutlined />,
								flipY: <SwapOutlined rotate={90} />,
							},
							visible,
							getContainer: "#root",
						}}
					/>
				</>
			) : (
				<Empty />
			)}
		</div>
	);
};

export default ViewImage;
