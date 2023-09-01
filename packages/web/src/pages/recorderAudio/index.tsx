import React, { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useStopwatch } from "react-timer-hook";
import {
	BsPlayFill,
	BsPauseFill,
	BsTrash,
	BsRecordFill,
	BsCheckLg,
	BsMicMute,
	BsMic,
} from "react-icons/bs";
import { Button } from "antd";
import Wavesurfer from "@/components/wavesurfer";
import Timer from "@pear-rec/timer";
import ininitApp from "@/pages/main";
import "@pear-rec/timer/lib/style.css";
import styles from "./index.module.scss";

const RecordAudio = () => {
	const { t } = useTranslation();
	const wavesurferRef = useRef<any>();
	const mediaStream = useRef<MediaStream>();
	const mediaRecorder = useRef<MediaRecorder>(); // 媒体录制器对象
	const recordedChunks = useRef<Blob[]>([]); // 存储录制的音频数据
	const audioTrack = useRef<any>(); // 音频轨道对象
	const [isPause, setIsPause] = useState(false); // 标记是否暂停
	const [isRecording, setIsRecording] = useState(false); // 标记是否正在录制
	const [isMute, setIsMute] = useState(false); // 标记是否静音
	const isSave = useRef<boolean>(false);
	const timer = useStopwatch({ autoStart: false });

	function startRecording() {
		navigator.mediaDevices
			.getUserMedia({ audio: true })
			.then((stream) => {
				mediaStream.current = stream;
				audioTrack.current = stream.getAudioTracks()[0];
				audioTrack.current.enabled = true; // 开启音频轨道
				mediaRecorder.current = new MediaRecorder(stream);
				mediaRecorder.current.addEventListener("dataavailable", (e) => {
					if (e.data.size > 0) {
						recordedChunks.current.push(e.data);
					}
				});
				mediaRecorder.current.addEventListener("stop", () => {
					isSave.current && exportRecording();
				});
				mediaRecorder.current.start();
				setIsRecording(true);
				wavesurferRef.current.play();
				timer.start();
				console.log("开始录音...");
			})
			.catch((error) => {
				console.error("无法获取麦克风权限：", error);
			});
	}

	// 静音录制
	function muteRecording() {
		if (audioTrack.current) {
			audioTrack.current.enabled = false; // 关闭音频轨道
			setIsMute(true);
			console.log("录音已静音");
		}
	}

	// 取消静音
	function unmuteRecording() {
		if (audioTrack.current) {
			audioTrack.current.enabled = true; // 开启音频轨道
			setIsMute(false);
			console.log("取消静音");
		}
	}

	// 暂停录制
	function pauseRecording() {
		if (!isPause && mediaRecorder.current.state === "recording") {
			mediaRecorder.current.pause();
			setIsPause(true);
			wavesurferRef.current.pause();
			timer.pause();
			console.log("录音已暂停");
		}
	}

	// 恢复录制
	function resumeRecording() {
		if (isPause && mediaRecorder.current.state === "paused") {
			mediaRecorder.current.resume();
			setIsPause(false);
			wavesurferRef.current.play();
			timer.start();
			console.log("恢复录音...");
		}
	}

	// 停止录制，并将录制的音频数据导出为 Blob 对象
	function stopRecording() {
		if (isRecording) {
			mediaRecorder.current.stop();
			mediaStream.current?.getTracks().forEach((track) => track.stop());
			setIsRecording(false);
			timer.reset(null, false);
			wavesurferRef.current.reset();
			recordedChunks.current = [];
			console.log("录音完成！");
		}
	}
	// 导出录制的音频文件
	function saveRecording() {
		stopRecording();
		isSave.current = true;
	}

	// 导出录制的音频文件
	function exportRecording() {
		if (recordedChunks.current.length > 0) {
			const blob = new Blob(recordedChunks.current, { type: "audio/webm" });
			const url = URL.createObjectURL(blob);
			if (window.electronAPI) {
				window.electronAPI.sendRaDownloadRecord(url);
			} else {
				const link = document.createElement("a");
				link.href = url;
				link.download = `pear-rec_${+new Date()}.webm`;
				link.click();
				recordedChunks.current = [];
				isSave.current = false;
			}
		}
	}

	return (
		<div
			className={`${styles.recordAudio} ${
				window.isElectron ? styles.electron : styles.web
			}`}
		>
			<span className="micBtn">
				{!isMute ? (
					<BsMicMute title={t("recorderAudio.mute")} onClick={muteRecording} />
				) : (
					<BsMic title={t("recorderAudio.unmute")} onClick={unmuteRecording} />
				)}
			</span>
			<div className="timer">
				<Timer
					seconds={timer.seconds}
					minutes={timer.minutes}
					hours={timer.hours}
				/>
			</div>
			<Wavesurfer ref={wavesurferRef} />
			<div className="recorderTools">
				<Button
					shape="circle"
					icon={<BsTrash />}
					className="toolbarIcon resetBtn"
					title={t("recorderAudio.delete")}
					disabled={!isRecording}
					onClick={stopRecording}
				/>
				{isRecording ? (
					<Button
						danger
						type="primary"
						shape="circle"
						icon={<BsCheckLg />}
						className="toolbarIcon stopBtn"
						title={t("recorderAudio.save")}
						disabled={!isRecording}
						onClick={saveRecording}
					/>
				) : (
					<Button
						danger
						type="primary"
						shape="circle"
						icon={<BsRecordFill />}
						className="toolbarIcon playBtn"
						title={t("recorderAudio.play")}
						onClick={startRecording}
					/>
				)}

				{isPause ? (
					<Button
						type="primary"
						shape="circle"
						icon={<BsPlayFill />}
						className="toolbarIcon resumeBtn"
						title={t("recorderAudio.resume")}
						disabled={!isRecording}
						onClick={resumeRecording}
					/>
				) : (
					<Button
						type="primary"
						shape="circle"
						icon={<BsPauseFill />}
						className="toolbarIcon pauseBtn"
						title={t("recorderAudio.pause")}
						disabled={!isRecording}
						onClick={pauseRecording}
					/>
				)}
			</div>
		</div>
	);
};

ininitApp(RecordAudio);
export default RecordAudio;
