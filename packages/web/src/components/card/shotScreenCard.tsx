import React, { useState, useImperativeHandle, forwardRef } from "react";
import { ScissorOutlined } from "@ant-design/icons";
import { Button, Card } from "antd";

const ShotScreenCard = forwardRef((props: any, ref: any) => {
	useImperativeHandle(ref, () => ({
		handleCutScreen,
	}));

	function handleCutScreen() {
		window.electronAPI
			? window.electronAPI.sendSsOpenWin()
			: (location.href = "/shotScreen.html");
	}

	return (
		<Card
			title="截屏"
			hoverable
			bordered={false}
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
