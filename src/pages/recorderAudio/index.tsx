import React, { useState, useRef, useEffect } from "react";
import useMediaRecorder from "../../components/useMediaRecorder";
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

const RecordAudio = () => {
	const [isPlay, setIsPlay] = useState(false);
	const [isPause, setIsPause] = useState(false);
	const {
		mediaUrl,
		startRecord,
		resumeRecord,
		pauseRecord,
		stopRecord,
		clearBlobUrl,
		getAudioStream,
	} = useMediaRecorder({
		audio: true,
		onStop: (url: string) => {
			console.log(`录音完成，${url}`);
			ipcRenderer.send("ra:download-record", {
				downloadUrl: url,
			});
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

	return (
		<div className="recordAudio">
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

export default RecordAudio;
