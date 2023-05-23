import React, {
	useEffect,
	useState,
	useImperativeHandle,
	forwardRef,
} from "react";
import { AudioOutlined, AudioMutedOutlined } from "@ant-design/icons";
import { Button, Card } from "antd";
import { ipcRenderer } from "electron";

const RecordAudioCard = forwardRef((props: any, ref: any) => {
	useImperativeHandle(ref, () => ({ setIsRecordAudio }));
	const [isRecordAudio, setIsRecordAudio] = useState(true);

	function handleRecordAudio() {
		ipcRenderer.send("ra:open-win");
	}

	return (
		<Card
			title="录音"
			hoverable
			bordered={false}
			// extra={<a href="#">More</a>}
			style={{ maxWidth: 300 }}
			onClick={handleRecordAudio}
		>
			<div className="cardContent">
				{isRecordAudio ? <AudioOutlined /> : <AudioMutedOutlined />}
			</div>
		</Card>
	);
});

export default RecordAudioCard;
