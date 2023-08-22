import React, { useState, useImperativeHandle, forwardRef } from "react";
import { PlayCircleOutlined } from "@ant-design/icons";
import { BsMusicNoteBeamed } from "react-icons/bs";
import { Button, Card, Upload } from "antd";
import type { UploadProps } from "antd/es/upload/interface";

const ViewAudioCard = forwardRef((props: any, ref: any) => {
	useImperativeHandle(ref, () => ({
		handleViewAudio,
	}));

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

	function handleViewAudio(e) {
		window.electronAPI
			? window.electronAPI.sendVaOpenWin()
			: (location.href = "/viewAudio.html");
		e.stopPropagation();
	}

	return (
		<Upload {...uploadProps}>
			<Card
				title="查看音频"
				hoverable
				bordered={false}
				extra={
					<Button type="link" onClick={handleViewAudio}>
						历史
					</Button>
				}
				style={{ maxWidth: 300 }}
			>
				<div className="cardContent">
					<BsMusicNoteBeamed rev={undefined} />
				</div>
			</Card>
		</Upload>
	);
});

export default ViewAudioCard;
