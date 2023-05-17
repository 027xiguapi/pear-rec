import React, {
	useEffect,
	useState,
	useImperativeHandle,
	forwardRef,
} from "react";
import { PlayCircleOutlined } from "@ant-design/icons";
import { Button, Card } from "antd";
import type { SizeType } from "antd/es/config-provider/SizeContext";
import { ipcRenderer } from "electron";

const ViewVideoCard = forwardRef((props: any, ref: any) => {
	useImperativeHandle(ref, () => ({
		handleViewVideo,
	}));
	const [size, setSize] = useState<SizeType>("large");

	function handleViewVideo() {
		ipcRenderer.send("vv:open-win");
	}

	function handleOpenFile(e: any) {
		e.stopPropagation();
		getVideo();
	}

	async function getVideo() {
		const video = await ipcRenderer.invoke("vv:get-video");
		if (video) {
			ipcRenderer.send("ma:hide-win");
			ipcRenderer.send("vv:open-win");
		}
	}

	return (
		<Card
			title="查看视频"
			hoverable
			bordered={false}
			extra={
				<Button type="link" onClick={handleOpenFile}>
					更多
				</Button>
			}
			style={{ maxWidth: 300 }}
			onClick={handleViewVideo}
		>
			<div className="cardContent">
				<Button type="link" icon={<PlayCircleOutlined />} size={size} />
			</div>
		</Card>
	);
});

export default ViewVideoCard;
