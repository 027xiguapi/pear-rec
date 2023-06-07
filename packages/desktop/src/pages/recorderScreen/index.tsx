import React, { useState, useEffect } from "react";
import { ipcRenderer } from "electron";
import { useStopwatch } from "react-timer-hook";
import {
	BsStop,
	BsMic,
	BsMicMute,
	BsPlayFill,
	BsPause,
	BsArrowRepeat,
	BsFillStopFill,
	BsChevronLeft,
	BsChevronRight,
} from "react-icons/bs";
import {
	PushpinOutlined,
	MinusOutlined,
	BorderOutlined,
	BlockOutlined,
	CloseOutlined,
} from "@ant-design/icons";
import { Button } from "antd";
import Timer from "@pear-rec/timer/lib/index";
import useMediaRecorder from "@/components/useMediaRecorder";
import "./index.scss";

async function getDesktopCapturerSource() {
	return await ipcRenderer.invoke("rs:get-desktop-capturer-source");
}

const RecorderScreen = () => {
	const { seconds, minutes, hours, days, isRunning, start, pause, reset } =
		useStopwatch({ autoStart: false });
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
		start();
		ipcRenderer.send("rs:start-record");
	}

	function handlePauseRecord() {
		console.log("handlePauseRecord");
		setIsPause(true);
		pauseRecord();
		pause();
		ipcRenderer.send("rs:pause-record");
	}

	function handleResumeRecord() {
		console.log("handleResumeRecord");
		setIsPause(false);
		resumeRecord();
		ipcRenderer.send("rs:start-record");
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

	async function handleCloseWin() {
		ipcRenderer.send("rs:close-win");
	}

	async function handleHideWin() {
		ipcRenderer.send("rs:hide-win");
	}

	function handleMinimizeWin() {
		ipcRenderer.send("rs:minimize-win");
	}

	return (
		<div className="recorderScreen">
			<div className="recorderTools">
				{isRunning ? (
					<>
						<Button
							type="text"
							icon={<BsPause />}
							className="toolbarIcon pauseBtn"
							title="暂停"
							onClick={handlePauseRecord}
						/>
						<Button
							className={`toolbarIcon toggleMuteBtn ${isMuted ? "" : "muted"}`}
							type="text"
							onClick={handleToggleMute}
							icon={isMuted ? <BsMicMute /> : <BsMic />}
							title={isMuted ? "打开声音" : "禁音"}
						/>
						<Button
							type="text"
							icon={<BsFillStopFill />}
							className="toolbarIcon stopBtn"
							title="停止"
							onClick={handleStopRecord}
						/>
					</>
				) : (
					<Button
						type="text"
						icon={<BsPlayFill />}
						className="toolbarIcon playBtn"
						title="开始"
						onClick={handleStartRecord}
					/>
				)}
			</div>
			<Timer seconds={seconds} minutes={minutes} hours={hours} />
			<div className="winBar">
				<Button
					type="text"
					icon={<MinusOutlined rev={undefined} />}
					className="toolbarIcon"
					title="最小化"
					onClick={handleMinimizeWin}
				/>
				<Button
					type="text"
					icon={<CloseOutlined rev={undefined} />}
					className="toolbarIcon"
					title="关闭"
					onClick={handleCloseWin}
				/>
			</div>
		</div>
	);
};

export default RecorderScreen;
