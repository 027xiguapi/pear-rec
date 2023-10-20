import React, { useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { BsPlayFill, BsPause } from "react-icons/bs";
import { Button } from "antd";

const PauseRecorder = (props) => {
	const { t } = useTranslation();
	const [isPause, setIsPause] = useState(false); // 标记是否暂停

	// 暂停录制
	function pauseRecording() {
		if (!isPause) {
			props.pauseRecord();
			setIsPause(true);
			window.electronAPI?.sendRsPauseRecord();
			console.log("录像已暂停");
		}
	}

	// 恢复录制
	function resumeRecording() {
		if (isPause) {
			props.resumeRecord();
			setIsPause(false);
			// timer.start();
			window.electronAPI?.sendRsStartRecord();
			console.log("恢复录像...");
		}
	}

	function handleTogglePause() {
		isPause ? resumeRecording() : pauseRecording();
	}

	return (
		<Button
			type="text"
			icon={isPause ? <BsPlayFill /> : <BsPause />}
			className="toolbarIcon pauseBtn"
			title={isPause ? t("recorderScreen.resume") : t("recorderScreen.pause")}
			onClick={handleTogglePause}
		/>
	);
};

export default PauseRecorder;
