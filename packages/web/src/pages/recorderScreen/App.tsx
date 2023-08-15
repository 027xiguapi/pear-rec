import React, { useState, useEffect } from "react";
import { useStopwatch } from "react-timer-hook";
import { CameraOutlined } from "@ant-design/icons";
import {
	BsStop,
	BsMic,
	BsMicMute,
	BsPlayFill,
	BsPause,
	BsArrowRepeat,
	BsFillStopFill,
	BsRecordCircle,
	BsChevronRight,
} from "react-icons/bs";

import { Button, InputNumber, Select } from "antd";
import Timer from "@pear-rec/timer";
import { desktop, screen } from "@pear-rec/recorder";
import "@pear-rec/timer/lib/style.css";
import styles from "./App.module.scss";

const RecorderScreen = () => {
	const { seconds, minutes, hours, days, isRunning, start, pause, reset } =
		useStopwatch({ autoStart: false });
	const [record, setRecord] = useState<any>();
	const [isPlay, setIsPlay] = useState(false);
	const [isPause, setIsPause] = useState(false);
	const [isMuted, setIsMuted] = useState(false);
	const [width, setWidth] = useState<number | null>(800);
	const [height, setHeight] = useState<number | null>(600);
	const [isSave, setIsSave] = useState(false);

	useEffect(() => {
		initRecord();
		window.electronAPI?.handleRsGetSizeClipWin((event, bounds) => {
			let { width, height } = bounds;
			setWidth(width);
			setHeight(height);
		});
	}, []);

	async function initRecord() {
		let mediaBlobs = [];
		const constraints = window.electronAPI ? await doScreenRecorder() : {};
		const _record = window.electronAPI
			? desktop().setMediaStreamConstraints(constraints as any)
			: screen();
		setRecord(_record);
		_record.create();
		_record.on("error", (type: any, message: any) => {
			console.log(type, message);
		});
		_record.onstop(async () => {
			console.log("onstop", mediaBlobs);
			const blob = _record.getBlob();
			if (blob?.size) {
				const bloburl = _record.getBlobUrl();
				setIsSave(true);
				window.electronAPI
					? window.electronAPI.sendRsDownloadRecord(bloburl)
					: _record.downloadBlob(`pear-rec_${+new Date()}`);
			}
		});
	}

	async function doScreenRecorder() {
		const sources =
			await window.electronAPI?.invokeRsGetDesktopCapturerSource();
		const source = sources.filter((e: any) => e.id == "screen:0:0")[0];
		const constraints = {
			audio: false,
			video: {
				mandatory: {
					chromeMediaSource: "desktop",
					chromeMediaSourceId: source.id,
				},
			},
		};
		return constraints;
	}

	function handleStartRecord() {
		console.log("handleStartRecord");
		setIsPlay(true);
		record.start();
		start();
		window.electronAPI?.sendRsStartRecord();
	}

	function handlePauseRecord() {
		console.log("handlePauseRecord");
		setIsPause(true);
		record.pause();
		pause();
		window.electronAPI?.sendRsPauseRecord();
	}

	function handleResumeRecord() {
		console.log("handleResumeRecord");
		setIsPause(false);
		record.resume();
		window.electronAPI?.sendRsStartRecord();
	}

	function handleStopRecord() {
		console.log("handleStopRecord");
		setIsPlay(false);
		record.stop();
		reset();
		pause();
		window.electronAPI?.sendRsStopRecord();
	}

	function handleToggleMute() {
		console.log("handleToggleMute");
		record.toggleMute(!isMuted);
	}

	function handleOpenSettingWin() {
		window.electronAPI
			? window.electronAPI.sendRsOpenWin()
			: (location.href = "/setting.html");
	}

	function handleChangeWidth(width: number) {
		setWidth(width);
		window.electronAPI.sendCsSetBounds(width, height);
	}

	function handleChangeHeight(height: number) {
		setHeight(height);
		window.electronAPI.sendCsSetBounds(width, height);
	}

	function handleChangeFormat(format: string) {
		console.log(`selected ${format}`);
	}

	function handleShotScreen() {
		window.electronAPI?.sendRsShotScreen();
	}

	return (
		<div className={styles.recorderScreen}>
			<div className="footer">
				<div className="recorderTools">
					{isSave ? (
						<Button type="text" loading>
							正在保存...
						</Button>
					) : isRunning ? (
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
						<>
							<span className="toolbarTitle">开始</span>
							<Button
								type="text"
								icon={<BsPlayFill />}
								className="toolbarIcon playBtn"
								title="开始"
								onClick={handleStartRecord}
							></Button>
						</>
					)}
				</div>
				<Timer
					seconds={seconds}
					minutes={minutes}
					hours={hours}
					className="timer"
				/>
				<InputNumber
					prefix="长"
					min={100}
					value={width}
					onChange={handleChangeWidth}
				/>
				<span className="sizeIcon">x</span>
				<InputNumber
					prefix="高"
					min={50}
					value={height}
					onChange={handleChangeHeight}
				/>
				<Select
					disabled
					defaultValue="mp4"
					style={{ width: 120 }}
					options={[{ value: "mp4", label: "mp4" }]}
					onChange={handleChangeFormat}
				/>
				<div className="drgan"></div>
				<CameraOutlined
					rev={undefined}
					className={"recordIcon shotScreenBtn"}
					onClick={handleShotScreen}
				/>
				<BsRecordCircle
					className={"recordIcon " + `${isPlay ? "blink" : ""}`}
				/>
			</div>
		</div>
	);
};

export default RecorderScreen;
