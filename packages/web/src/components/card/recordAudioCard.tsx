import React, { useState, useImperativeHandle, forwardRef } from "react";
import { AudioOutlined, AudioMutedOutlined } from "@ant-design/icons";
import { Button, Card } from "antd";
import { useNavigate } from "react-router-dom";

const RecordAudioCard = forwardRef((props: any, ref: any) => {
	const navigate = useNavigate();
	useImperativeHandle(ref, () => ({ setIsRecordAudio }));
	const [isRecordAudio, setIsRecordAudio] = useState(true);

	function handleRecordAudio() {
		window.electronAPI
			? window.electronAPI.sendRaOpenWin()
			: navigate("/recorderAudio");
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
