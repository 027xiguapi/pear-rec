import React, { useState, useImperativeHandle, forwardRef } from "react";
import { useTranslation } from "react-i18next";
import { PlayCircleOutlined, DownOutlined } from "@ant-design/icons";
import { Space, Card, Upload } from "antd";
import type { UploadProps } from "antd/es/upload/interface";

const ViewVideoCard = forwardRef((props: any, ref: any) => {
	useImperativeHandle(ref, () => ({
		handleViewVideo,
	}));

	const { t } = useTranslation();
	const [isHistory, setIsHistory] = useState(false);

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

	function handleToggle() {
		setIsHistory(!isHistory);
	}
	return (
		<Upload {...uploadProps}>
			<Card
				hoverable
				bordered={false}
				style={{ maxWidth: 300, minWidth: 200, height: 130 }}
			>
				<div className="cardContent">
					<Space>
						{isHistory ? (
							<PlayCircleOutlined
								className="cardIcon"
								onClick={handleViewVideo}
							/>
						) : (
							<Upload {...uploadProps}>
								<PlayCircleOutlined className="cardIcon" />
							</Upload>
						)}
						<DownOutlined className="cardToggle" onClick={handleToggle} />
					</Space>
					<div className="cardTitle">
						{isHistory ? t("home.history") : t("home.viewImage")}
					</div>
				</div>
			</Card>
		</Upload>
	);
});

export default ViewVideoCard;
