import React, { useState, useEffect } from "react";
import Header from "@/components/common/header";
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
import Timer from "@pear-rec/timer";
import useMediaRecorder from "@/components/useMediaRecorder";
import "@pear-rec/timer/lib/style.css";
import styles from "./index.module.scss";

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
		// const sources = await ipcRenderer.invoke("rs:get-desktop-capturer-source");
		// setSource(sources.filter((e: any) => e.id == "screen:0:0")[0]);
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
			blob && window.electronAPI?.sendRsDownloadRecord(url);
		},
	});

	function handleStartRecord() {
		console.log("handleStartRecord");
		setIsPlay(true);
		startRecord();
		start();
		window.electronAPI?.sendRsStartRecord();
	}

	function handlePauseRecord() {
		console.log("handlePauseRecord");
		setIsPause(true);
		pauseRecord();
		pause();
		window.electronAPI?.sendRsPauseRecord();
	}

	function handleResumeRecord() {
		console.log("handleResumeRecord");
		setIsPause(false);
		resumeRecord();
		window.electronAPI?.sendRsStartRecord();
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
		window.electronAPI?.sendRsCloseWin();
	}

	async function handleHideWin() {
		window.electronAPI?.sendRsHideWin();
	}

	function handleMinimizeWin() {
		window.electronAPI?.sendRsMinimizeWin();
	}

	return (
		<div
			className={styles.recorderScreen}
			style={{ marginTop: window.isElectron ? "0" : "30px" }}
		>
			<Header />
			<div className="container">
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
									className={`toolbarIcon toggleMuteBtn ${
										isMuted ? "" : "muted"
									}`}
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
					{/* <Timer seconds={seconds} minutes={minutes} hours={hours} /> */}
					{/* <div className="winBar">
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
					</div> */}
				</div>
			</div>
		</div>
	);
};

export default RecorderScreen;
