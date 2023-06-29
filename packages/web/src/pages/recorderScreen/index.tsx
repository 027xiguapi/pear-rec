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
	SettingOutlined,
} from "@ant-design/icons";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";
import Timer from "@pear-rec/timer";
import { desktop, screen } from "@pear-rec/recorder";
import "@pear-rec/timer/lib/style.css";
import styles from "./index.module.scss";
import logo from "/imgs/logo/logo.ico";
import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";

const RecorderScreen = () => {
	const navigate = useNavigate();
	const { seconds, minutes, hours, days, isRunning, start, pause, reset } =
		useStopwatch({ autoStart: false });
	const [record, setRecord] = useState<any>();
	const [isPlay, setIsPlay] = useState(false);
	const [isPause, setIsPause] = useState(false);
	const [isMuted, setIsMuted] = useState(false);

	useEffect(() => {
		initRecord();
	}, []);

	async function initRecord() {
		let mediaBlobs = [];
		// const innerCropArea = document.querySelector("#innerCropArea");
		// const cropTarget = await (window as any).CropTarget.fromElement(
		// 	innerCropArea,
		// );
		// const stream = await navigator.mediaDevices.getDisplayMedia({
		// 	preferCurrentTab: true,
		// } as any);

		// const constraints = window.electronAPI ? await doScreenRecorder() : {};
		// const stream = await navigator.mediaDevices.getUserMedia(constraints);
		// const [videoTrack] = stream.getVideoTracks();
		// console.log(videoTrack);
		// await (videoTrack as any).cropTo(cropTarget);
		// const _record = new MediaRecorder(stream);

		const constraints = window.electronAPI ? await doScreenRecorder() : {};
		const _record = window.electronAPI
			? desktop().setMediaStreamConstraints(constraints as any)
			: screen();
		setRecord(_record);
		_record.create();
		console.log(_record);
		_record.on("error", (type: any, message: any) => {
			console.log(type, message);
		});
		_record.onstop(async () => {
			console.log("onstop", mediaBlobs);
			const blob = _record.getBlob();
			const blobUrl = _record.getBlobUrl();
			if (blob?.size) {
				const { x, y, width, height } =
					await window.electronAPI?.invokeRsPauseRecord();
				console.log(x, y, width, height);
				const ffmpeg = createFFmpeg({ log: true });
				const name = `pear-rec_${+new Date()}.mp4`;
				await ffmpeg.load();
				ffmpeg.FS("writeFile", name, await fetchFile(blob));
				await ffmpeg.run(
					"-i",
					name,
					"-vf",
					`crop=${width - 10}:${height - 32 - 34}:${x + 5}:${y + 32}`,
					"output.mp4",
					"-y",
				);
				const data = ffmpeg.FS("readFile", "output.mp4");
				const url = URL.createObjectURL(
					new Blob([data.buffer], { type: "video/mp4" }),
				);
				console.log(url);
				window.electronAPI
					? window.electronAPI.sendRsDownloadRecord(url)
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
	}

	function handleToggleMute() {
		console.log("handleToggleMute");
		record.toggleMute(!isMuted);
	}

	function handleOpenSettingWin() {
		window.electronAPI
			? window.electronAPI.sendRsOpenWin()
			: navigate("/setting");
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
		<div className={styles.recorderScreen}>
			<div className="header">
				<div className="left">
					<img className="logo" src={logo} alt="logo" />
					<span>REC</span>
				</div>
				<div className="drgan"></div>
				<div className="right">
					<Button
						type="text"
						icon={<SettingOutlined rev={undefined} />}
						title="设置"
						onClick={handleOpenSettingWin}
					/>
					<Button
						type="text"
						icon={<MinusOutlined rev={undefined} />}
						title="最小化"
						onClick={handleMinimizeWin}
					/>
					<Button
						type="text"
						icon={<CloseOutlined rev={undefined} />}
						title="关闭"
						onClick={handleCloseWin}
					/>
				</div>
			</div>
			<div className="container">
				<div className="recorderScreen" id="innerCropArea"></div>
			</div>
			<div className="footer">
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
						></Button>
					)}
				</div>
				<Timer
					seconds={seconds}
					minutes={minutes}
					hours={hours}
					className="timer"
				/>
			</div>
		</div>
	);
};

export default RecorderScreen;
