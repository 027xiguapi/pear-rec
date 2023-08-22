import React, { useRef, useEffect, useState } from "react";
import { useStopwatch } from "react-timer-hook";
import { Button } from "antd";
import { CameraOutlined } from "@ant-design/icons";
import {
	BsRecordCircle,
	BsMic,
	BsMicMute,
	BsPlayFill,
	BsPause,
	BsFillStopFill,
} from "react-icons/bs";
import Timer from "@pear-rec/timer";
import ininitApp from "@/pages/main";
import "@pear-rec/timer/lib/style.css";
import styles from "./index.module.scss";

const RecorderVideo = () => {
	const previewVideo = useRef<HTMLVideoElement>();
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
			.getUserMedia({ video: true, audio: true })
			.then((stream) => {
				previewVideo.current!.srcObject = stream;
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
				timer.start();
				console.log("开始录像...");
			})
			.catch((error) => {
				console.error("无法获取媒体权限：", error);
			});
	}

	// 静音录制
	function muteRecording() {
		if (audioTrack.current) {
			audioTrack.current.enabled = false; // 关闭音频轨道
			setIsMute(true);
			console.log("录像已静音");
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
			timer.pause();
			console.log("录像已暂停");
		}
	}

	// 恢复录制
	function resumeRecording() {
		if (isPause && mediaRecorder.current.state === "paused") {
			mediaRecorder.current.resume();
			setIsPause(false);
			timer.start();
			console.log("恢复录像...");
		}
	}

	// 停止录制，并将录制的音频数据导出为 Blob 对象
	function stopRecording() {
		if (isRecording) {
			mediaRecorder.current.stop();
			mediaStream.current?.getTracks().forEach((track) => track.stop());
			setIsRecording(false);
			timer.reset(null, false);
			recordedChunks.current = [];
			console.log("录像完成！");
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

	function handleShotScreen() {
		window.electronAPI?.sendRvShotScreen();
	}

	function handleToggleMute() {
		isMute ? unmuteRecording() : muteRecording();
	}

	return (
		<div className={styles.recorderVideo}>
			<video className="content" ref={previewVideo} playsInline autoPlay />
			<div className="footer">
				<BsRecordCircle
					className={"recordIcon " + `${isRecording ? "blink" : ""}`}
				/>
				<CameraOutlined
					rev={undefined}
					className={"recordIcon shotScreenBtn"}
					onClick={handleShotScreen}
				/>
				<div className="drgan"></div>
				<Timer
					seconds={timer.seconds}
					minutes={timer.minutes}
					hours={timer.hours}
					className="timer"
				/>
				<div className="recorderTools">
					{!isSave ? (
						<Button type="text" loading>
							正在保存...
						</Button>
					) : isRecording ? (
						<>
							<Button
								type="text"
								icon={<BsPause />}
								className="toolbarIcon pauseBtn"
								title="暂停"
								onClick={pauseRecording}
							/>
							<Button
								className={`toolbarIcon toggleMuteBtn ${isMute ? "" : "muted"}`}
								type="text"
								onClick={handleToggleMute}
								icon={isMute ? <BsMicMute /> : <BsMic />}
								title={isMute ? "打开声音" : "禁音"}
							/>
							<Button
								type="text"
								icon={<BsFillStopFill />}
								className="toolbarIcon stopBtn"
								title="保存"
								onClick={saveRecording}
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
								onClick={startRecording}
							></Button>
						</>
					)}
				</div>
			</div>
		</div>
	);
};

ininitApp(RecorderVideo);

export default RecorderVideo;
