import React, { useState, useImperativeHandle, forwardRef } from "react";
import { useTranslation } from "react-i18next";
import { CameraOutlined, DownOutlined } from "@ant-design/icons";
import { Card, Space } from "antd";

const RecordScreenCard = forwardRef((props: any, ref: any) => {
	useImperativeHandle(ref, () => ({}));
	const { t } = useTranslation();
	const [isFull, setIsFull] = useState(false);

	function handleClipScreen() {
		window.electronAPI
			? window.electronAPI.sendCsOpenWin()
			: (location.href = "/recorderScreen.html");
	}

	function handleRecordScreen() {
		window.electronAPI
			? window.electronAPI.sendRsOpenWin({ isFullScreen: true })
			: (location.href = "/recorderScreen.html");
	}

	function handleToggle(e: any) {
		setIsFull(!isFull);
		e.stopPropagation();
	}

	function handleRecord() {
		isFull ? handleRecordScreen() : handleClipScreen();
	}

	return (
		<Card
			hoverable
			bordered={false}
			style={{ maxWidth: 300, minWidth: 140, height: 130 }}
		>
			<div className="cardContent" onClick={handleRecord}>
				<Space>
					<CameraOutlined className="cardIcon" />
					<DownOutlined className="cardToggle" onClick={handleToggle} />
				</Space>
				<div className="cardTitle">
					{isFull ? t("home.fullScreen") : t("home.screenRecording")}
				</div>
			</div>
		</Card>
	);
});

export default RecordScreenCard;
