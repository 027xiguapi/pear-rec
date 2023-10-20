import React, { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { BsRecordCircle } from "react-icons/bs";
import { SettingOutlined } from "@ant-design/icons";
import { Button } from "antd";
import PlayRecorder from "./PlayRecorder";
import PauseRecorder from "./PauseRecorder";
import MuteRecorder from "./MuteRecorder";
import StopRecorder from "./StopRecorder";
import { saveAs } from "file-saver";

const ScreenRecorder = (props) => {
	const { t } = useTranslation();
	const [position, setPosition] = useState({ x: 200, y: 422 });
	const videoRef = useRef<HTMLVideoElement>();
	const mediaStream = useRef<MediaStream>();
	const mediaRecorder = useRef<MediaRecorder>(); // 媒体录制器对象
	const recordedChunks = useRef<Blob[]>([]); // 存储录制的音频数据
	const audioTrack = useRef<any>(); // 音频轨道对象
	const [isRecording, setIsRecording] = useState(false); // 标记是否正在录制
	const [isSave, setIsSave] = useState(false); // 标记是否正在保存

	useEffect(() => {
		getCropArea();
	}, []);

	async function getCropArea() {
		const innerCropArea = document.querySelector("#innerCropArea");
		const cropTarget = await (window as any).CropTarget.fromElement(
			innerCropArea,
		);

		mediaStream.current = await navigator.mediaDevices.getDisplayMedia({
			preferCurrentTab: true,
		} as any);
		const [videoTrack] = mediaStream.current.getVideoTracks();
		await (videoTrack as any).cropTo(cropTarget);
		videoRef.current.srcObject = mediaStream.current;
	}

	function setMediaRecorder() {
		mediaRecorder.current = new MediaRecorder(mediaStream.current);
		mediaRecorder.current.ondataavailable = (event) => {
			if (event.data.size > 0) {
				recordedChunks.current.push(event.data);
			}
		};
		mediaRecorder.current.onstop = (event) => {
			exportRecord();
		};
	}

	function handleOpenSettingWin() {
		window.electronAPI
			? window.electronAPI.sendSeOpenWin()
			: window.open("/setting.html");
	}

	function handleShotScreen() {
		if (window.electronAPI) {
			window.electronAPI.sendRsShotScreen();
		} else {
			// const canvas = document.createElement("canvas");
			// canvas.width = window.innerWidth;
			// canvas.height = window.innerHeight;
			// const context = canvas.getContext("2d");
			// context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
			// const url = canvas.toDataURL("image/png");
			// const link = document.createElement("a");
			// link.href = url;
			// link.download = `pear-rec_${+new Date()}.png`;
			// link.click();
		}
	}

	// 开始录制
	function handleStartRecord() {
		setMediaRecorder();
		mediaRecorder.current.start();
		setIsRecording(true);
		props.setIsRecording(true);
	}

	// 暂停录制
	function handlePauseRecord() {
		mediaRecorder.current.pause();
	}

	// 恢复录制
	function handleResumeRecord() {
		mediaRecorder.current.resume();
	}

	// 停止录制，并将录制的音频数据导出为 Blob 对象
	function handleStopRecord() {
		setIsSave(true);
		if (isRecording) {
			mediaRecorder.current.stop();
			// mediaStream.current?.getTracks().forEach((track) => track.stop());
			setIsRecording(false);
			props.setIsRecording(false);
			// timer.reset(null, false);
			console.log("录像完成！");
		}
	}

	// 导出录制的音频文件
	function exportRecord() {
		if (recordedChunks.current.length > 0) {
			const blob = new Blob(recordedChunks.current, { type: "video/webm" });
			const url = URL.createObjectURL(blob);
			recordedChunks.current = [];
			saveAs(url, `pear-rec_${+new Date()}.webm`);
		}
	}

	return (
		<div
			className="screenRecorder"
			style={{
				top: props.position.y + props.size.height + 2,
				left: props.position.x,
				width: props.size.width,
				// pointerEvents: isRecording ? "none" : "auto",
			}}
		>
			<video ref={videoRef} className="hide" playsInline autoPlay />
			<Button
				type="text"
				icon={<BsRecordCircle />}
				className={`toolbarIcon recordBtn ${isRecording ? "blink" : ""}`}
			></Button>
			<Button
				type="text"
				icon={<SettingOutlined />}
				className="toolbarIcon settingBtn"
				title={t("nav.setting")}
				onClick={handleOpenSettingWin}
			></Button>
			{/* <Button
				type="text"
				icon={<CameraOutlined />}
				className="toolbarIcon shotScreenBtn"
				title={t("recorderScreen.shotScreen")}
				// onClick={handleShotScreen}
			></Button> */}
			<div className="drgan"></div>
			{isRecording ? (
				<>
					{/* <MuteRecorder /> */}
					<PauseRecorder
						pauseRecord={handlePauseRecord}
						resumeRecord={handleResumeRecord}
					/>
					<StopRecorder stopRecord={handleStopRecord} />
				</>
			) : (
				<PlayRecorder startRecord={handleStartRecord} />
			)}
		</div>
	);
};

export default ScreenRecorder;
