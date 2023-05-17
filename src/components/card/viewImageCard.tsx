import React, {
	useEffect,
	useState,
	useImperativeHandle,
	forwardRef,
} from "react";
import { PictureOutlined } from "@ant-design/icons";
import { Button, Card } from "antd";
import type { SizeType } from "antd/es/config-provider/SizeContext";
import { ipcRenderer } from "electron";

const ViewImageCard = forwardRef((props: any, ref: any) => {
	useImperativeHandle(ref, () => ({
		handleViewImage,
	}));
	const [size, setSize] = useState<SizeType>("large");

	function handleViewImage() {
		ipcRenderer.send("vi:open-win");
	}

	function handleOpenFile(e: any) {
		e.stopPropagation();
		getImg();
	}

	async function getImg() {
		const img = await ipcRenderer.invoke("vi:get-img");
		if (img) {
			ipcRenderer.send("ma:hide-win");
			ipcRenderer.send("vi:open-win");
		}
	}

	return (
		<Card
			title="查看图片"
			hoverable
			bordered={false}
			extra={
				<Button type="link" onClick={handleOpenFile}>
					更多
				</Button>
			}
			style={{ maxWidth: 300 }}
			onClick={handleViewImage}
		>
			<div className="cardContent">
				<Button type="link" icon={<PictureOutlined />} size={size} />
			</div>
		</Card>
	);
});

export default ViewImageCard;
