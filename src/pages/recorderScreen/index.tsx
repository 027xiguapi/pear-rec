import React, { useState, useEffect } from "react";
import useMediaRecorder from "@/components/useMediaRecorder";
import { ipcRenderer } from "electron";
import {
	BsArrowsMove,
	BsRecordCircle,
	BsPower,
	BsStop,
	BsPlay,
	BsPause,
	BsMicMute,
	BsMic,
	BsXLg,
} from "react-icons/bs";
import { Button } from "antd";
import "./index.scss";

async function getDesktopCapturerSource() {
	return await ipcRenderer.invoke("rs:get-desktop-capturer-source");
}

const RecorderScreen = () => {
	const [source, setSource] = useState({});
	const [isPlay, setIsPlay] = useState(false);
	const [isPause, setIsPause] = useState(false);

	useEffect(() => {
		doScreenRecorder();
	}, []);

	async function doScreenRecorder() {
		const sources = await getDesktopCapturerSource();
		setSource(sources.filter((e: any) => e.id == "screen:0:0")[0]);
	}

	const {
		mediaUrl,
		isMuted,
		startRecord,
		resumeRecord,
		pauseRecord,
		stopRecord,
		clearBlobUrl,
		getMediaStream,
		toggleMute,
	} = useMediaRecorder({
		audio: true,
		screen: true,
		desktop: true,
		source: source,
		onStop: (url, blob) => {
			ipcRenderer.send("rs:download-record", url);
		},
	});

	function handleStartRecord() {
		console.log("handleStartRecord");
		setIsPlay(true);
		startRecord();
	}

	function handlePauseRecord() {
		console.log("handlePauseRecord");
		setIsPause(true);
		pauseRecord();
	}

	function handleResumeRecord() {
		console.log("handleResumeRecord");
		setIsPause(false);
		resumeRecord();
	}

	function handleStopRecord() {
		console.log("handleStopRecord");
		setIsPlay(false);
		stopRecord();
	}

	function handleToggleMute() {
		console.log("handleToggleMute");
		toggleMute(!isMuted);
	}

	return (
		<div className="recorderScreen">
			<Button
				size="large"
				type="text"
				className="move"
				icon={<BsArrowsMove />}
			/>
			<Button
				size="large"
				type="text"
				danger={isPlay}
				className={`record ${isPlay && !isPause ? "blink" : ""}`}
				icon={<BsRecordCircle />}
			/>
			{isPlay ? (
				<>
					{isPause ? (
						<Button
							size="large"
							type="text"
							onClick={handleResumeRecord}
							icon={<BsPlay />}
							title="恢复"
						/>
					) : (
						<Button
							size="large"
							type="text"
							onClick={handlePauseRecord}
							icon={<BsPause />}
							title="暂停"
						/>
					)}
					<Button
						size="large"
						type="text"
						onClick={handleStopRecord}
						icon={<BsStop />}
						title="停止"
					/>
					<Button
						size="large"
						type="text"
						onClick={handleToggleMute}
						icon={isMuted ? <BsMic /> : <BsMicMute />}
						title={isMuted ? "打开声音" : "禁音"}
					/>
					{/* <Button
						size="large"
						type="text"
						onClick={clearBlobUrl}
						icon={<BsXLg />}
						title="清除"
					/> */}
				</>
			) : (
				<Button
					size="large"
					type="link"
					onClick={handleStartRecord}
					icon={<BsPower />}
					title="开始"
				/>
			)}
		</div>
	);
};

export default RecorderScreen;
