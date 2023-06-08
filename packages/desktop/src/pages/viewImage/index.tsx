import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "react-router-dom";
// import { ipcRenderer } from "electron";
import { Button, Empty } from "antd";
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
	EditOutlined,
	CloseOutlined,
	LeftOutlined,
	RightOutlined,
	SwapOutlined,
	PushpinOutlined,
} from "@ant-design/icons";
import "@pear-rec/image/dist/style.css";
import "./index.scss";

const ViewImage = () => {
	const [search, setSearch] = useSearchParams();
	const [visible, setVisible] = useState(false);
	const [isAlwaysOnTop, setIsAlwaysOnTop] = useState(false);
	// const [imgs, setImgs] = useState<any>([]);
	const [imgSrc, setImgSrc] = useState("");

	useEffect(() => {
		setVisible(true);
		search.get("history") ? setHistoryImg() : setSsImg();
	}, []);

	function handleDownload() {}

	function handleEdit() {}

	function handlePrinter() {}

	async function handleOpenImage() {
		const imgs = await window.electronAPI?.invokeViGetImgs();
		// setImgs(imgs);
	}

	function handleToggleAlwaysOnTopWin() {
		const _isAlwaysOnTop = !isAlwaysOnTop;
		setIsAlwaysOnTop(_isAlwaysOnTop);
		window.electronAPI?.invokeViSetAlwaysOnTop(_isAlwaysOnTop);
	}

	async function setHistoryImg() {
		const img = window.electronAPI?.invokeViSetImg();
		if (img) {
			setImgSrc(img);
			// const images = [{ src: img, key: 0 }];
			// setImages(images);
		}
	}

	async function setSsImg() {
		const imgs = await window.electronAPI?.invokeViGetImgs();
		// setImages(imgs);
	}

	return (
		<div className="viewImage">
			{imgSrc ? (
				<>
					<div className="viewImageTools">
						<Button
							type="text"
							icon={<PushpinOutlined rev={undefined} />}
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
								rotateLeft: <RotateLeftOutlined rev={undefined} />,
								rotateRight: <RotateRightOutlined rev={undefined} />,
								zoomIn: <ZoomInOutlined rev={undefined} />,
								zoomOut: <ZoomOutOutlined rev={undefined} />,
								left: <LeftOutlined rev={undefined} />,
								right: <RightOutlined rev={undefined} />,
								flipX: <SwapOutlined rev={undefined} />,
								flipY: <SwapOutlined rev={undefined} rotate={90} />,
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
