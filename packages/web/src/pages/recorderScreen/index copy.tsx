import React, { useState, useEffect, useRef } from "react";
import { useStopwatch } from "react-timer-hook";
import { useTranslation } from "react-i18next";
import { CameraOutlined } from "@ant-design/icons";
import {
	BsMic,
	BsMicMute,
	BsPlayFill,
	BsPause,
	BsFillStopFill,
	BsRecordCircle,
} from "react-icons/bs";
import { SettingOutlined, CloseOutlined } from "@ant-design/icons";
import { Button, InputNumber, Select, Modal, message } from "antd";
import Timer from "@pear-rec/timer";
import ininitApp from "../../pages/main";
import { useApi } from "../../api";
import { useUserApi } from "../../api/user";
import "@pear-rec/timer/src/Timer/index.module.scss";
import styles from "./index.module.scss";

const RecorderScreen = () => {
	const { t } = useTranslation();
	const api = useApi();
	const userApi = useUserApi();
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
	const [isFullScreen, setIsFullScreen] = useState<boolean>(false);
	const [isHide, setIsHide] = useState<boolean>(false);
	const timer = useStopwatch({ autoStart: false });
	const [user, setUser] = useState({} as any);

	useEffect(() => {
		const paramsString = location.search;
		const searchParams = new URLSearchParams(paramsString);
		const isFullScreen = searchParams.get("isFullScreen") == "true";

		setIsFullScreen(isFullScreen);
		window.electronAPI?.handleRsGetSizeClipWin((event, bounds) => {
			let { width, height } = bounds;
			setWidth(width);
			setHeight(height);
		});

		window.electronAPI?.handleRsGetEndRecord(() => {
			setIsSave(false);
		});
		getCurrentUser();
	}, []);

	async function getCurrentUser() {
		try {
			const res = (await userApi.getCurrentUser()) as any;
			if (res.code == 0) {
				setUser(res.data);
			}
		} catch (err) {
			console.log(err);
		}
	}

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
			const blob = new Blob(recordedChunks.current, {
				type: "video/webm",
			});
			saveFile(blob);
		}
	}

	async function saveFile(blob) {
		try {
			recordedChunks.current = [];
			setIsSave(false);
			const formData = new FormData();
			formData.append("type", "rs");
			formData.append("userUuid", user.uuid);
			formData.append("file", blob);
			const res = (await api.saveFile(formData)) as any;
			if (res.code == 0) {
				Modal.confirm({
					title: "录屏已保存，是否查看？",
					content: `${res.data.filePath}`,
					okText: t("modal.ok"),
					cancelText: t("modal.cancel"),
					onOk() {
						window.open(`/viewVideo.html?videoUrl=${res.data.filePath}`);
						console.log("OK");
					},
					onCancel() {
						console.log("Cancel");
					},
				});
			}
		} catch (err) {
			message.error("保存失败");
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
		width && window.electronAPI.sendCsSetBounds({ width, height });
	}

	function handleChangeHeight(height: number) {
		setHeight(height);
		height && window.electronAPI.sendCsSetBounds({ width, height });
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

	function handleCloseWin() {
		window.electronAPI?.sendRsCloseWin();
	}

	return (
		<div className={styles.recorderScreen}>
			{window.isElectron || isFullScreen ? (
				<></>
			) : (
				<div className="content">
					{isRecording ? (
						<></>
					) : (
						<div className="tip">{t("recorderScreen.tip")}</div>
					)}
					<video ref={videoRef} playsInline autoPlay />
				</div>
			)}
			{isHide ? (
				<div className="footer"></div>
			) : (
				<div className="footer">
					<div className="recorderTools">
						{isSave ? (
							<Button type="text" loading>
								{t("recorderScreen.saving")}...
							</Button>
						) : isRecording ? (
							<>
								<Button
									type="text"
									icon={isPause ? <BsPlayFill /> : <BsPause />}
									className="toolbarIcon pauseBtn"
									title={
										isPause
											? t("recorderScreen.resume")
											: t("recorderScreen.pause")
									}
									onClick={handleTogglePause}
								/>
								<Button
									className={`toolbarIcon toggleMuteBtn ${
										isMute ? "" : "muted"
									}`}
									type="text"
									onClick={handleToggleMute}
									icon={isMute ? <BsMicMute /> : <BsMic />}
									title={
										isMute
											? t("recorderScreen.unmute")
											: t("recorderScreen.mute")
									}
								/>
								<Button
									type="text"
									icon={<BsFillStopFill />}
									className="toolbarIcon stopBtn"
									title={t("recorderScreen.save")}
									onClick={saveRecording}
								/>
							</>
						) : (
							<>
								<span className="toolbarTitle">{t("recorderScreen.play")}</span>
								<Button
									type="text"
									icon={<BsPlayFill />}
									className="toolbarIcon playBtn"
									title={t("recorderScreen.play")}
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
					{window.isElectron && !isFullScreen ? (
						<>
							<InputNumber
								className="widthInput"
								prefix={t("recorderScreen.width")}
								min={100}
								value={width}
								onChange={handleChangeWidth}
							/>
							<span className="sizeIcon">x</span>
							<InputNumber
								className="heightInput"
								prefix={t("recorderScreen.height")}
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
					{isFullScreen ? (
						<Button
							type="text"
							icon={<CloseOutlined />}
							className="toolbarIcon closeBtn"
							title={t("nav.close")}
							onClick={handleCloseWin}
						></Button>
					) : (
						<div className="drgan"></div>
					)}
					<Button
						type="text"
						icon={<SettingOutlined />}
						className="toolbarIcon settingBtn"
						title={t("nav.setting")}
						onClick={handleOpenSettingWin}
					></Button>
					<Button
						type="text"
						icon={<CameraOutlined />}
						className="toolbarIcon shotScreenBtn"
						title={t("recorderScreen.shotScreen")}
						onClick={handleShotScreen}
					></Button>
					<BsRecordCircle
						className={
							"recordIcon " + `${isRecording && !isPause ? "blink" : ""}`
						}
					/>
				</div>
			)}
		</div>
	);
};

ininitApp(RecorderScreen);
export default RecorderScreen;
