import React, { useState, useImperativeHandle, forwardRef } from "react";
import { CameraOutlined } from "@ant-design/icons";
import { Button, Card } from "antd";

const RecordScreenCard = forwardRef((props: any, ref: any) => {
	useImperativeHandle(ref, () => ({}));
	const [isRecordScreen, setIsRecordScreen] = useState(true);

	function handleClipScreen() {
		window.electronAPI
			? window.electronAPI.sendCsOpenWin()
			: (location.href = "/recorderScreen.html");
	}

	function handleRecordScreen(e) {
		window.electronAPI
			? window.electronAPI.sendRsOpenWin()
			: (location.href = "/recorderScreen.html");

		e.stopPropagation();
	}

	return (
		<Card
			title="录屏"
			hoverable
			bordered={false}
			extra={
				<Button type="link" onClick={handleRecordScreen}>
					全屏
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
