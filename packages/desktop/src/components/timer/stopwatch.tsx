import React, { useState } from "react";
import { useStopwatch } from "react-timer-hook";
import {
	BsStop,
	BsPlayFill,
	BsPause,
	BsArrowRepeat,
	BsFillStopFill,
	BsChevronLeft,
	BsChevronRight,
} from "react-icons/bs";
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
						<BsPause
							className="icon pauseBtn"
							title="暂停"
							onClick={handlePause}
						/>
						{/* <BsArrowRepeat
							className="icon"
							title="重置"
							onClick={handleReset}
						/> */}
						<BsFillStopFill
							className="icon stopBtn"
							title="停止"
							onClick={handleStop}
						/>
					</>
				) : (
					<BsPlayFill
						className="icon playBtn"
						title="开始"
						onClick={handleStart}
					/>
				)}
			</div>
			<div className="toggleTimer"></div>
			<TimerStyled seconds={seconds} minutes={minutes} hours={hours} />
		</div>
	);
}

export default Stopwatch;
