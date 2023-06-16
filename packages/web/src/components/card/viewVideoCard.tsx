import React, { useState, useImperativeHandle, forwardRef } from "react";
import { PlayCircleOutlined } from "@ant-design/icons";
import { Button, Card, Upload } from "antd";
import { useNavigate } from "react-router-dom";
import type { UploadProps } from "antd/es/upload/interface";

const ViewVideoCard = forwardRef((props: any, ref: any) => {
	const navigate = useNavigate();
	useImperativeHandle(ref, () => ({
		handleViewVideo,
	}));

	const uploadProps: UploadProps = {
		accept: "video/*",
		name: "file",
		multiple: false,
		showUploadList: false,
		customRequest: () => {},
		beforeUpload: (file) => {
			const url = window.URL.createObjectURL(file);
			window.electronAPI
				? window.electronAPI.sendVvOpenWin({ url })
				: navigate(`/viewVideo?url=${encodeURIComponent(url)}`);
			return false;
		},
	};

	function handleViewVideo(e) {
		window.electronAPI
			? window.electronAPI.sendVvOpenWin()
			: navigate("/viewVideo");
		e.stopPropagation();
	}

	return (
		<Upload {...uploadProps}>
			<Card
				title="查看视频"
				hoverable
				bordered={false}
				extra={
					<Button type="link" onClick={handleViewVideo}>
						打开
					</Button>
				}
				style={{ maxWidth: 300, width: 210 }}
			>
				<div className="cardContent">
					<PlayCircleOutlined rev={undefined} />
				</div>
			</Card>
		</Upload>
	);
});

export default ViewVideoCard;
