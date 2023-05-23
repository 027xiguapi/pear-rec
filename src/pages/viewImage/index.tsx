import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { ipcRenderer } from "electron";
import { PhotoProvider, PhotoView, PhotoSlider } from "react-photo-view";
import { Button, Row, Col } from "antd";
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
} from "@ant-design/icons";
import "react-photo-view/dist/react-photo-view.css";
import WinBar from "@/components/common/winBar";
import "./index.scss";

const ViewImage = () => {
	const [search, setSearch] = useSearchParams();
	const viewImageRef = useRef<HTMLDivElement | null>(null);
	const [visible, setVisible] = useState(false);
	const [index, setIndex] = useState(0);
	const [images, setImages] = useState<any>([]);

	useEffect(() => {
		setVisible(true);
		setSsImg();
		search.get("history") ? setHistoryImg() : setSsImg();
	}, []);

	function handleDownload() {}

	function handleEdit() {}

	function handlePrinter() {}

	async function handleOpenImage() {
		const images = await ipcRenderer.invoke("vi:get-images", "选择图片");
		setImages(images);
	}

	function handleRotate() {}

	function handleScale() {}

	async function setHistoryImg() {
		const img = await ipcRenderer.invoke("vi:set-img");
		if (img) {
			const images = [{ src: img, key: 0 }];
			setImages(images);
		}
	}

	async function setSsImg() {
		const imgs = await ipcRenderer.invoke("vi:set-imgs");
		setImages(imgs);
	}

	return (
		<div className="viewImage" ref={viewImageRef}>
			<PhotoSlider
				images={images}
				visible={visible}
				bannerVisible={false}
				maskOpacity={0.01}
				onClose={() => {}}
				index={index}
				onIndexChange={setIndex}
				maskClosable={false}
				pullClosable={false}
				portalContainer={viewImageRef.current as HTMLElement}
				overlayRender={({ rotate, onRotate, scale, onScale }) => {
					return (
						<div className="viewImageHeader">
							<div className="viewImageHeaderLeft">
								<Button
									type="text"
									icon={<FileImageOutlined />}
									className="toolbarIcon"
									title="打开图片"
									onClick={handleOpenImage}
								/>
								<Button
									type="text"
									icon={<ZoomInOutlined />}
									className="toolbarIcon"
									title="放大"
									onClick={() => {
										onScale(scale + 1);
									}}
								/>
								<Button
									type="text"
									icon={<ZoomOutOutlined />}
									className="toolbarIcon"
									title="缩小"
									onClick={() => onScale(scale - 1)}
								/>
								<Button
									type="text"
									icon={<RotateRightOutlined />}
									className="toolbarIcon"
									title="右转"
									onClick={() => onRotate(rotate + 90)}
								/>
								<Button
									type="text"
									icon={<RotateLeftOutlined />}
									className="toolbarIcon"
									title="左转"
									onClick={() => onRotate(rotate - 90)}
								/>
								<Button
									type="text"
									icon={<SyncOutlined />}
									className="toolbarIcon"
									title="恢复"
									onClick={() => onRotate(0)}
								/>
								<Button
									type="text"
									icon={<DownloadOutlined />}
									className="toolbarIcon"
									title="下载"
									onClick={handleDownload}
								/>
								<Button
									type="text"
									icon={<EditOutlined />}
									className="toolbarIcon"
									title="编辑"
									onClick={handleEdit}
								/>
								<Button
									type="text"
									icon={<PrinterOutlined />}
									className="toolbarIcon"
									title="打印"
									onClick={handlePrinter}
								/>
							</div>
							<div className="viewImageHeaderCenter"></div>
							<WinBar />
						</div>
					);
				}}
			/>
		</div>
	);
};

export default ViewImage;
