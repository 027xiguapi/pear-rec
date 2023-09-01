import React, { useState, useImperativeHandle, forwardRef } from "react";
import { useTranslation } from "react-i18next";
import { CameraOutlined } from "@ant-design/icons";
import { Button, Card } from "antd";

const RecordScreenCard = forwardRef((props: any, ref: any) => {
	useImperativeHandle(ref, () => ({}));

	const { t } = useTranslation();

	const [isRecordScreen, setIsRecordScreen] = useState(true);

	function handleClipScreen() {
		window.electronAPI
			? window.electronAPI.sendCsOpenWin()
			: (location.href = "/recorderScreen.html");
	}

	function handleRecordScreen(e) {
		window.electronAPI
			? window.electronAPI.sendRsOpenWin({ isFullScreen: true })
			: (location.href = "/recorderScreen.html");

		e.stopPropagation();
	}

	return (
		<Card
			title={t("home.screenRecording")}
			hoverable
			bordered={false}
			extra={
				<Button type="link" onClick={handleRecordScreen}>
					{t("home.fullScreen")}
				</Button>
			}
			style={{ maxWidth: 300 }}
			onClick={handleClipScreen}
		>
			<div className="cardContent">
				<CameraOutlined rev={undefined} />
			</div>
		</Card>
	);
});

export default RecordScreenCard;
