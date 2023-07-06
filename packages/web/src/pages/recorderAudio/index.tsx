import React, { useState, useRef, useEffect } from "react";
import { useStopwatch } from "react-timer-hook";
import {
	BsPlayFill,
	BsPauseFill,
	BsFillStopFill,
	BsTrash,
	BsRecordFill,
	BsCheckLg,
} from "react-icons/bs";
import { Button } from "antd";
import Wavesurfer from "@/components/wavesurfer";
import Timer from "@pear-rec/timer";
import { audio } from "@pear-rec/recorder";
import "@pear-rec/timer/lib/style.css";
import styles from "./index.module.scss";

const RecordAudio = () => {
	const wavesurferRef = useRef<any>();
	const [record, setRecord] = useState<any>();
	const [isPause, setIsPause] = useState(false);
	const [isPlay, setIsPlay] = useState(false);
	const { seconds, minutes, hours, isRunning, start, pause, reset } =
		useStopwatch({ autoStart: false });

	useEffect(() => {
		initRecord();
	}, []);

	function initRecord() {
		const _record = audio();
		_record.create();

		_record.on("error", (type: any, message: any) => {
			console.log(type, message);
		});
		_record.onstop(() => {
			const blob = _record.getBlob();
			const url = _record.getBlobUrl();
			blob?.size &&
				(window.electronAPI
					? window.electronAPI.sendRaDownloadRecord(url)
					: _record.downloadBlob(`pear-rec_${+new Date()}`));
		});
		setRecord(_record);
	}

	function handleStartRecord() {
		console.log("handleStartRecord");
		start();
		record.start();
		setIsPause(false);
		setIsPlay(true);
		wavesurferRef.current.play();
	}

	function handlePauseRecord() {
		console.log("handlePauseRecord");
		pause();
		setIsPause(true);
		record.pause();
		wavesurferRef.current.pause();
	}

	function handleResumeRecord() {
		console.log("handleResumeRecord");
		record.resume();
		setIsPause(false);
		setIsPlay(true);
		wavesurferRef.current.play();
	}

	function handleStopRecord() {
		console.log("handleStopRecord");
		record.stop();
		reset(undefined, false);
		setIsPause(false);
		setIsPlay(false);
		wavesurferRef.current.stop();
	}

	function handleResetRecord() {
		console.log("handleResetRecord");
		record.reset();
		reset(undefined, false);
		setIsPause(false);
		setIsPlay(false);
		wavesurferRef.current.reset();
	}

	return (
		<div
			className={`${styles.recordAudio} ${
				window.isElectron ? styles.electron : styles.web
			}`}
		>
			<div className="timer">
				<Timer seconds={seconds} minutes={minutes} hours={hours} />
			</div>
			<Wavesurfer ref={wavesurferRef} />
			<div className="recorderTools">
				<Button
					shape="circle"
					icon={<BsTrash />}
					className="toolbarIcon resetBtn"
					title="删除"
					disabled={!isPlay}
					onClick={handleResetRecord}
				/>
				{isPlay ? (
					<Button
						danger
						type="primary"
						shape="circle"
						icon={<BsCheckLg />}
						className="toolbarIcon stopBtn"
						title="保存"
						disabled={!isPlay}
						onClick={handleStopRecord}
					/>
				) : (
					<Button
						danger
						type="primary"
						shape="circle"
						icon={<BsRecordFill />}
						className="toolbarIcon playBtn"
						title="开始"
						onClick={handleStartRecord}
					/>
				)}

				{isPause ? (
					<Button
						type="primary"
						shape="circle"
						icon={<BsPlayFill />}
						className="toolbarIcon resumeBtn"
						title="继续"
						disabled={!isPlay}
						onClick={handleResumeRecord}
					/>
				) : (
					<Button
						type="primary"
						shape="circle"
						icon={<BsPauseFill />}
						className="toolbarIcon pauseBtn"
						title="暂停"
						disabled={!isPlay}
						onClick={handlePauseRecord}
					/>
				)}
			</div>
		</div>
	);
};

export default RecordAudio;
