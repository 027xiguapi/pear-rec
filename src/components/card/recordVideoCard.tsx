import React, {
	useEffect,
	useState,
	useImperativeHandle,
	forwardRef,
} from "react";
import { useNavigate } from "react-router-dom";
import { VideoCameraOutlined } from "@ant-design/icons";
import { Button, Card } from "antd";
import type { SizeType } from "antd/es/config-provider/SizeContext";
import { ipcRenderer } from "electron";

const RecordVideoCard = forwardRef((props: any, ref: any) => {
	const Navigate = useNavigate();
	useImperativeHandle(ref, () => ({ setIsRecordVideo }));
	const [size, setSize] = useState<SizeType>("large");
	const [isRecordVideo, setIsRecordVideo] = useState(true);

	function handleRecorderVideo() {
		// Navigate("/recorderVideo");
		ipcRenderer.send("rv:open-win");
	}

	return (
		<Card
			title="录像"
			hoverable
			bordered={false}
			extra={<a href="#">More</a>}
			style={{ maxWidth: 300 }}
			onClick={handleRecorderVideo}
		>
			<div className="cardContent">
				<Button
					type="link"
					disabled={!isRecordVideo}
					icon={<VideoCameraOutlined />}
					size={size}
				/>
			</div>
		</Card>
	);
});

export default RecordVideoCard;
