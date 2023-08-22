import React, { useState, useEffect, useRef } from "react";
import { useStopwatch } from "react-timer-hook";
import { CameraOutlined } from "@ant-design/icons";
import {
	BsMic,
	BsMicMute,
	BsPlayFill,
	BsPause,
	BsFillStopFill,
	BsRecordCircle,
} from "react-icons/bs";
import { Button, InputNumber, Select } from "antd";
import Timer from "@pear-rec/timer";
import ininitApp from "@/pages/main";
import "@pear-rec/timer/lib/style.css";
import styles from "./index.module.scss";

const RecorderScreen = () => {
	const videoRef = useRef<HTMLVideoElement>();
	const mediaStream = useRef<MediaStream>();
	const mediaRecorder = useRef<MediaRecorder>(); // 媒体录制器对象
	const recordedChunks = useRef<Blob[]>([]); // 存储录制的音频数据
	const audioTrack = useRef<any>(); // 音频轨道对象
	const [isPause, setIsPause] = useState(false); // 标记是否暂停
	const [isRecording, setIsRecording] = useState(false); // 标记是否正在录制
	const [isMute, setIsMute] = useState(false); // 标记是否静音
	const [isSave, setIsSave] = useState(false); // 标记是否正在保存
	const [width, setWidth] = useState<number | null>(800);
	const [height, setHeight] = useState<number | null>(600);
	const timer = useStopwatch({ autoStart: false });

	useEffect(() => {
		window.electronAPI?.handleRsGetShotScreen((event) => {
			// setIsPlay(true);
		});
		window.electronAPI?.handleRsGetSizeClipWin((event, bounds) => {
			let { width, height } = bounds;
			setWidth(width);
			setHeight(height);
		});
	}, []);

	function handleStartRecording() {
		if (window.electronAPI) {
			startRecordingElectron();
		} else {
			startRecordingWeb();
		}
		window.electronAPI?.sendRsStartRecord();
	}

	function startRecordingWeb() {
		navigator.mediaDevices
			.getDisplayMedia({ video: true, audio: true })
			.then((stream) => {
				videoRef.current!.srcObject = stream;
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
					exportRecording();
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
			window.electronAPI?.sendRsPauseRecord();
			console.log("录像已暂停");
		}
	}

	// 恢复录制
	function resumeRecording() {
		if (isPause && mediaRecorder.current.state === "paused") {
			mediaRecorder.current.resume();
			setIsPause(false);
			timer.start();
			window.electronAPI?.sendRsStartRecord();
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
			window.electronAPI?.sendRsStopRecord();
			console.log("录像完成！");
		}
	}
	// 导出录制的音频文件
	function saveRecording() {
		setIsSave(true);
		stopRecording();
	}

	// 导出录制的音频文件
	function exportRecording() {
		if (recordedChunks.current.length > 0) {
			const blob = new Blob(recordedChunks.current, { type: "audio/webm" });
			const url = URL.createObjectURL(blob);
			if (window.electronAPI) {
				window.electronAPI.sendRsDownloadRecord(url);
			} else {
				const link = document.createElement("a");
				link.href = url;
				link.download = `pear-rec_${+new Date()}.webm`;
				link.click();
				recordedChunks.current = [];
				setIsSave(false);
			}
		}
	}

	function handleToggleMute() {
		isMute ? unmuteRecording() : muteRecording();
	}

	async function startRecordingElectron() {
		const sources =
			await window.electronAPI?.invokeRsGetDesktopCapturerSource();
		const source = sources.filter((e: any) => e.id == "screen:0:0")[0];
		const constraints: any = {
			audio: false,
			video: {
				mandatory: {
					chromeMediaSource: "desktop",
					chromeMediaSourceId: source.id,
				},
			},
		};
		navigator.mediaDevices
			.getUserMedia(constraints)
			.then((stream) => {
				mediaStream.current = stream;
				// audioTrack.current = stream.getAudioTracks()[0];
				// audioTrack.current.enabled = true; // 开启音频轨道
				mediaRecorder.current = new MediaRecorder(stream);
				mediaRecorder.current.addEventListener("dataavailable", (e) => {
					if (e.data.size > 0) {
						recordedChunks.current.push(e.data);
					}
				});
				mediaRecorder.current.addEventListener("stop", () => {
					exportRecording();
				});
				mediaRecorder.current.start();
				setIsRecording(true);
				timer.start();
				console.log("开始录像...");
			})
			.catch((error) => {
				console.error("无法获取媒体权限：", error);
			});
		return constraints;
	}

	function handleOpenSettingWin() {
		window.electronAPI
			? window.electronAPI.sendSeOpenWin()
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
		if (window.electronAPI) {
			window.electronAPI.sendRsShotScreen();
		} else {
			const canvas = document.createElement("canvas");
			canvas.width = window.innerWidth;
			canvas.height = window.innerHeight;
			const context = canvas.getContext("2d");
			context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
			const url = canvas.toDataURL("image/png");
			const link = document.createElement("a");
			link.href = url;
			link.download = `pear-rec_${+new Date()}.png`;
			link.click();
		}
	}

	function handleTogglePause() {
		isPause ? resumeRecording() : pauseRecording();
	}

	return (
		<div className={styles.recorderScreen}>
			{window.isElectron ? (
				<></>
			) : (
				<div className="content">
					{isRecording ? (
						<></>
					) : (
						<div className="tip"> 点击下面开始按钮开始录制 </div>
					)}
					<video ref={videoRef} playsInline autoPlay />
				</div>
			)}
			<div className="footer">
				<div className="recorderTools">
					{isSave ? (
						<Button type="text" loading>
							正在保存...
						</Button>
					) : isRecording ? (
						<>
							<Button
								type="text"
								icon={isPause ? <BsPlayFill /> : <BsPause />}
								className="toolbarIcon pauseBtn"
								title={isPause ? "继续" : "暂停"}
								onClick={handleTogglePause}
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
								title="停止"
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
								onClick={handleStartRecording}
							></Button>
						</>
					)}
				</div>
				<Timer
					seconds={timer.seconds}
					minutes={timer.minutes}
					hours={timer.hours}
					className="timer"
				/>
				{window.isElectron ? (
					<>
						<InputNumber
							className="widthInput"
							prefix="长"
							min={100}
							value={width}
							onChange={handleChangeWidth}
						/>
						<span className="sizeIcon">x</span>
						<InputNumber
							className="heightInput"
							prefix="高"
							min={50}
							value={height}
							onChange={handleChangeHeight}
						/>
						<Select
							disabled
							defaultValue="mp4"
							className="formatSelect"
							style={{ width: 120 }}
							options={[{ value: "mp4", label: "mp4" }]}
							onChange={handleChangeFormat}
						/>
					</>
				) : (
					<></>
				)}
				<div className="drgan"></div>
				<CameraOutlined
					rev={undefined}
					className={"recordIcon shotScreenBtn"}
					onClick={handleShotScreen}
				/>
				<BsRecordCircle
					className={
						"recordIcon " + `${isRecording && !isPause ? "blink" : ""}`
					}
				/>
			</div>
		</div>
	);
};

ininitApp(RecorderScreen);
export default RecorderScreen;
