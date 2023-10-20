import React, { useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { BsPlayFill } from "react-icons/bs";
import { Button } from "antd";

const PlayRecorder = (props) => {
	const { t } = useTranslation();

	function startRecord() {
		props.startRecord();
		window.electronAPI?.sendRsStartRecord();
		console.log("开始录像...");
	}

	return (
		<div className="playRecorder">
			<div className="toolbarTitle">{t("recorderScreen.play")}</div>
			<Button
				type="text"
				icon={<BsPlayFill />}
				className="toolbarIcon playBtn"
				title={t("recorderScreen.play")}
				onClick={startRecord}
			></Button>
		</div>
	);
};

export default PlayRecorder;
