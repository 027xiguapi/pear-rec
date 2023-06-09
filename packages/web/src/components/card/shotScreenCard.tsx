import React, { useState, useImperativeHandle, forwardRef } from "react";
import { ScissorOutlined } from "@ant-design/icons";
import { Button, Card } from "antd";
import { useNavigate } from "react-router-dom";

const ShotScreenCard = forwardRef((props: any, ref: any) => {
	const navigate = useNavigate();
	useImperativeHandle(ref, () => ({
		handleCutScreen,
	}));
	const [isCutScreen, setIsCutScreen] = useState(true);

	function handleCutScreen() {
		window.electronAPI
			? window.electronAPI.sendSsOpenWin()
			: navigate("/shotScreen");
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
				<ScissorOutlined rev={undefined} />
			</div>
		</Card>
	);
});

export default ShotScreenCard;
