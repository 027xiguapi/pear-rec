import React, { useState, useImperativeHandle, forwardRef } from "react";
import { useTranslation } from "react-i18next";
import { AudioOutlined, AudioMutedOutlined } from "@ant-design/icons";
import { Button, Card } from "antd";

const RecordAudioCard = forwardRef((props: any, ref: any) => {
	useImperativeHandle(ref, () => ({ setIsRecordAudio }));

	const { t } = useTranslation();

	const [isRecordAudio, setIsRecordAudio] = useState(true);

	function handleRecordAudio() {
		window.electronAPI
			? window.electronAPI.sendRaOpenWin()
			: (location.href = "/recorderAudio.html");
	}

	return (
		<Card
			// title={t("home.audioRecording")}
			hoverable
			bordered={false}
			style={{ maxWidth: 300, height: 145 }}
			onClick={handleRecordAudio}
		>
			<div className="cardContent">
				{isRecordAudio ? (
					<AudioOutlined rev={undefined} />
				) : (
					<AudioMutedOutlined rev={undefined} />
				)}
				<div className="cardTitle">{t("home.audioRecording")}</div>
			</div>
		</Card>
	);
});

export default RecordAudioCard;
