import React, { useState, useImperativeHandle, forwardRef } from "react";
import { useTranslation } from "react-i18next";
import { ScissorOutlined } from "@ant-design/icons";
import { Button, Card } from "antd";

const ShotScreenCard = forwardRef((props: any, ref: any) => {
	useImperativeHandle(ref, () => ({
		handleCutScreen,
	}));

	const { t } = useTranslation();

	function handleCutScreen() {
		window.electronAPI
			? window.electronAPI.sendSsOpenWin()
			: (location.href = "/shotScreen.html");
	}

	return (
		<Card
			title={t("home.screenshot")}
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
