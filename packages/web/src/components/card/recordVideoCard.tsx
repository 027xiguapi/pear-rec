import React, { useState, useImperativeHandle, forwardRef } from "react";
import { VideoCameraOutlined } from "@ant-design/icons";
import { Button, Card } from "antd";

const RecordVideoCard = forwardRef((props: any, ref: any) => {
	useImperativeHandle(ref, () => ({ setIsRecordVideo }));
	const [isRecordVideo, setIsRecordVideo] = useState(true);

	function handleRecorderVideo() {
		window.electronAPI
			? window.electronAPI.sendRvOpenWin()
			: (location.href = "/recorderVideo.html");
	}

	return (
		<Card
			title="录像"
			hoverable
			bordered={false}
			extra={<a href="#">更多</a>}
			style={{ maxWidth: 300 }}
			onClick={handleRecorderVideo}
		>
			<div className="cardContent">
				<VideoCameraOutlined rev={undefined} />
			</div>
		</Card>
	);
});

export default RecordVideoCard;
