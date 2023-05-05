import React, {
	FunctionComponent,
	HTMLAttributes,
	useEffect,
	useState,
	useRef,
} from "react";
import { PhotoProvider, PhotoView, PhotoSlider } from "react-photo-view";
import { Button, Row, Col } from "antd";
import {
	ZoomInOutlined,
	ZoomOutOutlined,
	RotateLeftOutlined,
	RotateRightOutlined,
	RedoOutlined,
	UndoOutlined,
	SyncOutlined,
	DownloadOutlined,
	PrinterOutlined,
	CloseOutlined,
	BorderOutlined,
	BlockOutlined,
	MinusOutlined,
} from "@ant-design/icons";
import "react-photo-view/dist/react-photo-view.css";
import { IpcEvents } from "@/ipcEvents";
import "./index.scss";

const ViewImage = () => {
	const viewImageRef = useRef(null);
	const photoSliderRef = useRef(null);
	const [visible, setVisible] = useState(false);
	const [index, setIndex] = useState(0);
	const images = [
		"http://localhost:3000/assets/imgs/1.jpg",
		// "https://react-photo-view.vercel.app/_next/static/media/2.b43f1ead.jpg",
	];

	useEffect(() => {
		setVisible(true);
	}, []);

	function handleDownload() {
		console.log(121);
	}

	function handleClose() {
		setVisible(false);
		window.electronAPI?.ipcRenderer.send(IpcEvents.EV_CLOSE_VIEW_IMAGE_WIN);
	}

	function handleHide() {
		window.electronAPI?.ipcRenderer.send(IpcEvents.EV_HIDE_VIEW_IMAGE_WIN);
	}

	function handleFullScreen() {
		window.electronAPI?.ipcRenderer.send(
			IpcEvents.EV_FULL_SCREEN_VIEW_IMAGE_WIN,
		);
	}

	function handlePrinter() {}

	function handleRotate() {}

	function handleScale() {}

	return (
		<div className="viewImage" ref={viewImageRef}>
			<PhotoSlider
				images={images.map((item) => ({ src: item, key: item }))}
				visible={visible}
				bannerVisible={false}
				maskOpacity={0}
				onClose={() => handleClose()}
				index={index}
				onIndexChange={setIndex}
				maskClosable={false}
				pullClosable={false}
				portalContainer={viewImageRef.current}
				overlayRender={({ rotate, onRotate, scale, onScale, onClose }) => {
					return (
						<div className="viewImageHeader">
							<div className="viewImageHeaderLeft">
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
									icon={<PrinterOutlined />}
									className="toolbarIcon"
									title="恢复"
									onClick={handlePrinter}
								/>
								{/* <MinusCircleOutlined
									className="toolbarIcon"
									title="缩小"
									onClick={() => onScale(scale - 1)}
								/>
								<RotateRightOutlined
									className="toolbarIcon"
									title="右转"
									onClick={() => onRotate(rotate + 90)}
								/>
								<RotateLeftOutlined
									className="toolbarIcon"
									title="左转"
									onClick={() => onRotate(rotate - 90)}
								/>
								<SyncOutlined
									className="toolbarIcon"
									title="恢复"
									onClick={() => onRotate(0)}
								/>
								<DownloadOutlined
									className="toolbarIcon"
									title="下载"
									onClick={handleDownload}
								/>
								<PrinterOutlined
									className="toolbarIcon"
									title="打印"
									onClick={handleDownload}
								/> */}
							</div>
							<div className="viewImageHeaderCenter"></div>
							<div className="viewImageHeaderRight">
								<Button
									type="text"
									icon={<MinusOutlined />}
									className="toolbarIcon"
									title="隐藏"
									onClick={() => handleHide()}
								/>
								<Button
									type="text"
									icon={<BorderOutlined />}
									className="toolbarIcon"
									title="全屏"
									onClick={() => handleFullScreen()}
								/>
								<Button
									type="text"
									icon={<CloseOutlined />}
									className="toolbarIcon"
									title="关闭"
									onClick={() => handleClose()}
								/>
								{/* <MinusOutlined
									className="toolbarIcon"
									title="隐藏"
									onClick={() => handleHide()}
								/>
								<BorderOutlined
									className="toolbarIcon"
									title="全屏"
									onClick={() => handleFullScreen()}
								/>
								<CloseOutlined
									className="toolbarIcon"
									title="关闭"
									onClick={() => handleClose()}
								/> */}
							</div>
						</div>
					);
				}}
			/>
		</div>
	);
};

export default ViewImage;
