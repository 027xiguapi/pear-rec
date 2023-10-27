import React, { useState, useRef } from "react";
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

const MuteRecorder = () => {
	const { t } = useTranslation();
	const [isMute, setIsMute] = useState(false); // 标记是否静音

	function handleToggleMute() {
		isMute ? unmuteRecording() : muteRecording();
	}

	// 静音录制
	function muteRecording() {
		setIsMute(true);
		console.log("录像已静音");
	}

	// 取消静音
	function unmuteRecording() {
		setIsMute(false);
		console.log("取消静音");
	}

	return (
		<Button
			className={`toolbarIcon toggleMuteBtn ${isMute ? "" : "muted"}`}
			type="text"
			onClick={handleToggleMute}
			icon={isMute ? <BsMicMute /> : <BsMic />}
			title={isMute ? t("recorderScreen.unmute") : t("recorderScreen.mute")}
		/>
	);
};

export default MuteRecorder;
