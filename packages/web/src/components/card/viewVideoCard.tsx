import React, { useState, useImperativeHandle, forwardRef } from "react";
import { useTranslation } from "react-i18next";
import { PlayCircleOutlined } from "@ant-design/icons";
import { Button, Card, Upload } from "antd";
import type { UploadProps } from "antd/es/upload/interface";

const ViewVideoCard = forwardRef((props: any, ref: any) => {
	useImperativeHandle(ref, () => ({
		handleViewVideo,
	}));

	const { t } = useTranslation();

	const uploadProps: UploadProps = {
		accept: "video/*",
		name: "file",
		multiple: false,
		showUploadList: false,
		customRequest: () => {},
		beforeUpload: (file) => {
			if (window.electronAPI) {
				window.electronAPI.sendVvOpenWin({ url: file.path });
			} else {
				const url = window.URL.createObjectURL(file);
				window.open(`/viewVideo.html?videoUrl=${encodeURIComponent(url)}`);
			}
			return false;
		},
	};

	function handleViewVideo(e: any) {
		window.electronAPI
			? window.electronAPI.sendVvOpenWin()
			: (location.href = "/viewVideo.html");
		e.stopPropagation();
	}

	return (
		<Upload {...uploadProps}>
			<Card
				// title={t("home.watchVideo")}
				hoverable
				bordered={false}
				// extra={
				// 	<Button type="link" onClick={handleViewVideo}>
				// 		{t("home.history")}
				// 	</Button>
				// }
				style={{ maxWidth: 300, height: 145 }}
			>
				<div className="cardContent">
					<PlayCircleOutlined rev={undefined} />
					<div className="cardTitle">{t("home.watchVideo")}</div>
				</div>
			</Card>
		</Upload>
	);
});

export default ViewVideoCard;
