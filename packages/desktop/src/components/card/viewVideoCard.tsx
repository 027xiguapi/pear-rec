import React, { useState, useImperativeHandle, forwardRef } from "react";
import { PlayCircleOutlined } from "@ant-design/icons";
import { Button, Card } from "antd";
import { useNavigate } from "react-router-dom";

const ViewVideoCard = forwardRef((props: any, ref: any) => {
	const navigate = useNavigate();
	useImperativeHandle(ref, () => ({
		handleViewVideo,
	}));

	function handleViewVideo() {
		window.electronAPI
			? window.electronAPI.sendVvOpenWin()
			: navigate("/viewVideo");
	}

	function handleOpenFile(e: any) {
		e.stopPropagation();
		getVideo();
	}

	async function getVideo() {
		// const video = await ipcRenderer.invoke("vv:get-video");
		// if (video) {
		// 	ipcRenderer.send("ma:hide-win");
		// 	ipcRenderer.send("vv:open-win");
		// }
	}

	return (
		<Card
			title="查看视频"
			hoverable
			bordered={false}
			extra={
				<Button type="link" onClick={handleOpenFile}>
					打开
				</Button>
			}
			style={{ maxWidth: 300 }}
			onClick={handleViewVideo}
		>
			<div className="cardContent">
				<PlayCircleOutlined rev={undefined} />
			</div>
		</Card>
	);
});

export default ViewVideoCard;
