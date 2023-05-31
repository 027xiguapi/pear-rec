import React, {
	useEffect,
	useState,
	useImperativeHandle,
	forwardRef,
} from "react";
import { useNavigate } from "react-router-dom";
import { ScissorOutlined } from "@ant-design/icons";
import { Button, Card } from "antd";
import { ipcRenderer } from "electron";

const ShotScreenCard = forwardRef((props: any, ref: any) => {
	useImperativeHandle(ref, () => ({
		handleCutScreen,
	}));
	const [isCutScreen, setIsCutScreen] = useState(true);

	function handleCutScreen() {
		ipcRenderer.send("ss:open-win");
	}

	return (
		<Card
			title="截屏"
			hoverable
			bordered={false}
			extra={<a href="#">更多</a>}
			style={{ maxWidth: 300 }}
			onClick={handleCutScreen}
		>
			<div className="cardContent">
				<ScissorOutlined />
			</div>
		</Card>
	);
});

export default ShotScreenCard;
