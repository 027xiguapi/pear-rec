import React, { useState, useImperativeHandle, forwardRef } from "react";
import { useTranslation } from "react-i18next";
import { BsMusicNoteBeamed } from "react-icons/bs";
import { Button, Card, Upload } from "antd";
import type { UploadProps } from "antd/es/upload/interface";

const ViewAudioCard = forwardRef((props: any, ref: any) => {
	useImperativeHandle(ref, () => ({
		handleViewAudio,
	}));

	const { t } = useTranslation();

	const uploadProps: UploadProps = {
		accept: "audio/*",
		name: "file",
		multiple: false,
		showUploadList: false,
		customRequest: () => {},
		beforeUpload: (file) => {
			if (window.electronAPI) {
				window.electronAPI.sendVaOpenWin({ url: file.path });
			} else {
				const url = window.URL.createObjectURL(file);
				window.open(`/viewAudio.html?audioUrl=${encodeURIComponent(url)}`);
			}
			return false;
		},
	};

	function handleViewAudio(e: any) {
		window.electronAPI
			? window.electronAPI.sendVaOpenWin()
			: (location.href = "/viewAudio.html");
		e.stopPropagation();
	}

	return (
		<Upload {...uploadProps}>
			<Card
				title={t("home.playAudio")}
				hoverable
				bordered={false}
				extra={
					<Button type="link" onClick={handleViewAudio}>
						{t("home.history")}
					</Button>
				}
				style={{ maxWidth: 300 }}
			>
				<div className="cardContent">
					<BsMusicNoteBeamed />
				</div>
			</Card>
		</Upload>
	);
});

export default ViewAudioCard;
