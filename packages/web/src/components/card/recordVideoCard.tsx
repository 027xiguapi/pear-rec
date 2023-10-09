import React, { useState, useImperativeHandle, forwardRef } from "react";
import { useTranslation } from "react-i18next";
import { VideoCameraOutlined } from "@ant-design/icons";
import { Button, Card } from "antd";

const RecordVideoCard = forwardRef((props: any, ref: any) => {
	useImperativeHandle(ref, () => ({ setIsRecordVideo }));

	const { t } = useTranslation();

	const [isRecordVideo, setIsRecordVideo] = useState(true);

	function handleRecorderVideo() {
		window.electronAPI
			? window.electronAPI.sendRvOpenWin()
			: (location.href = "/recorderVideo.html");
	}

	return (
		<Card
			// title={t("home.videoRecording")}
			hoverable
			bordered={false}
			style={{ maxWidth: 300, height: 145 }}
			onClick={handleRecorderVideo}
		>
			<div className="cardContent">
				<VideoCameraOutlined rev={undefined} />
				<div className="cardTitle">{t("home.videoRecording")}</div>
			</div>
		</Card>
	);
});

export default RecordVideoCard;
