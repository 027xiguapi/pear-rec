import React, {
	useEffect,
	useState,
	useImperativeHandle,
	forwardRef,
} from "react";
import { useNavigate } from "react-router-dom";
import { AudioOutlined, AudioMutedOutlined } from "@ant-design/icons";
import { Button, Card } from "antd";
import type { SizeType } from "antd/es/config-provider/SizeContext";
import { ipcRenderer } from "electron";

const RecordAudioCard = forwardRef((props: any, ref: any) => {
	const Navigate = useNavigate();
	useImperativeHandle(ref, () => ({ setIsRecordAudio }));
	const [size, setSize] = useState<SizeType>("large");
	const [isRecordAudio, setIsRecordAudio] = useState(true);

	function handleRecordAudio() {
		ipcRenderer.send("ra:open-win");
	}

	return (
		<Card
			title="录音"
			hoverable
			bordered={false}
			extra={<a href="#">More</a>}
			style={{ maxWidth: 300 }}
		>
			<div className="cardContent">
				<Button
					type="link"
					disabled={!isRecordAudio}
					icon={isRecordAudio ? <AudioOutlined /> : <AudioMutedOutlined />}
					size={size}
					onClick={handleRecordAudio}
				/>
			</div>
		</Card>
	);
});

export default RecordAudioCard;
