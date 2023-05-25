import React, { useState } from "react";
import { useStopwatch } from "react-timer-hook";
import { BsStop, BsPlay, BsPause, BsArrowRepeat } from "react-icons/bs";
import { Button } from "antd";
import { ipcRenderer } from "electron";
import TimerStyled from "./timerStyled";
import useMediaRecorder from "@/components/useMediaRecorder";

function Stopwatch({ expiryTimestamp }: any) {
	const [isPause, setIsPause] = useState(false);

	const { seconds, minutes, hours, days, isRunning, start, pause, reset } =
		useStopwatch({ autoStart: false });

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
			ipcRenderer.send("ra:download-record", url);
		},
	});

	function handleStart() {
		console.log("handleStartRecord");
		start();
		isPause ? resumeRecord : startRecord();
		ipcRenderer.send("ra:start-record");
	}

	function handlePause() {
		console.log("handlePauseRecord");
		pause();
		pauseRecord();
		setIsPause(true);
		ipcRenderer.send("ra:pause-record");
	}

	function handleReset() {
		reset();
	}

	function handleStop() {
		console.log("handleStopRecord");
		stopRecord();
		ipcRenderer.send("ra:stop-record");
	}

	return (
		<div className="stopwatch">
			<div className="stopwatchTools">
				{isRunning ? (
					<>
						<BsPause className="icon" title="暂停" onClick={handlePause} />
						{/* <BsArrowRepeat
							className="icon"
							title="重置"
							onClick={handleReset}
						/> */}
						<BsStop className="icon" title="停止" onClick={handleStop} />
					</>
				) : (
					<BsPlay className="icon" title="开始" onClick={handleStart} />
				)}
			</div>
			<TimerStyled seconds={seconds} minutes={minutes} hours={hours} />
		</div>
	);
}

export default Stopwatch;
