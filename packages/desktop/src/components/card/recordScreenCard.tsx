import React, {
	useEffect,
	useState,
	useImperativeHandle,
	forwardRef,
} from "react";
import { CameraOutlined } from "@ant-design/icons";
import { Button, Card } from "antd";
import { ipcRenderer } from "electron";

const RecordScreenCard = forwardRef((props: any, ref: any) => {
	useImperativeHandle(ref, () => ({}));
	const [isRecordScreen, setIsRecordScreen] = useState(true);

	function handleCutScreen() {
		ipcRenderer.send("rs:open-win");
	}

	return (
		<Card
			title="录屏"
			hoverable
			bordered={false}
			extra={<a href="#">更多</a>}
			style={{ maxWidth: 300 }}
			onClick={handleCutScreen}
		>
			<div className="cardContent">
				<CameraOutlined />
			</div>
		</Card>
	);
});

export default RecordScreenCard;
