import React, { useState, useImperativeHandle, forwardRef } from "react";
import { AudioOutlined, AudioMutedOutlined } from "@ant-design/icons";
import { Button, Card } from "antd";

const RecordAudioCard = forwardRef((props: any, ref: any) => {
	useImperativeHandle(ref, () => ({ setIsRecordAudio }));
	const [isRecordAudio, setIsRecordAudio] = useState(true);

	function handleRecordAudio() {
		window.electronAPI
			? window.electronAPI.sendRaOpenWin()
			: (location.href = "/recorderAudio.html");
	}

	return (
		<Card
			title="录音"
			hoverable
			bordered={false}
			style={{ maxWidth: 300 }}
			onClick={handleRecordAudio}
		>
			<div className="cardContent">
				{isRecordAudio ? (
					<AudioOutlined rev={undefined} />
				) : (
					<AudioMutedOutlined rev={undefined} />
				)}
			</div>
		</Card>
	);
});

export default RecordAudioCard;
