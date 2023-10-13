import React, { useState, useImperativeHandle, forwardRef } from "react";
import { useTranslation } from "react-i18next";
import { BsMusicNoteBeamed } from "react-icons/bs";
import { DownOutlined } from "@ant-design/icons";
import { Space, Card, Upload } from "antd";
import type { UploadProps } from "antd/es/upload/interface";

const ViewAudioCard = forwardRef((props: any, ref: any) => {
	useImperativeHandle(ref, () => ({
		handleViewAudio,
	}));

	const { t } = useTranslation();
	const [isHistory, setIsHistory] = useState(false);

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

	function handleToggle() {
		setIsHistory(!isHistory);
	}

	return (
		<Card
			hoverable
			bordered={false}
			style={{ maxWidth: 300, minWidth: 200, height: 130 }}
		>
			<div className="cardContent">
				<Space>
					{isHistory ? (
						<BsMusicNoteBeamed className="cardIcon" onClick={handleViewAudio} />
					) : (
						<Upload {...uploadProps}>
							<BsMusicNoteBeamed className="cardIcon" />
						</Upload>
					)}
					<DownOutlined className="cardToggle" onClick={handleToggle} />
				</Space>
				<div className="cardTitle">
					{isHistory ? t("home.history") : t("home.playAudio")}
				</div>
			</div>
		</Card>
	);
});

export default ViewAudioCard;
