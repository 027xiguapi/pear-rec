import React, { useImperativeHandle, forwardRef } from "react";
import { PictureOutlined } from "@ant-design/icons";
import { Button, Card } from "antd";
import { useNavigate } from "react-router-dom";

const ViewImageCard = forwardRef((props: any, ref: any) => {
	const navigate = useNavigate();
	useImperativeHandle(ref, () => ({
		handleViewImage,
	}));

	function handleViewImage() {
		window.electronAPI
			? window.electronAPI.sendViOpenWin()
			: navigate("/viewImage");
	}

	function handleOpenFile(e: any) {
		e.stopPropagation();
		getImg();
	}

	async function getImg() {
		// const img = await ipcRenderer.invoke("vi:get-img");
		// if (img) {
		// 	ipcRenderer.send("ma:hide-win");
		// 	ipcRenderer.send("vi:open-win", true);
		// }
	}

	return (
		<Card
			title="查看图片"
			hoverable
			bordered={false}
			extra={
				<Button type="link" onClick={handleOpenFile}>
					打开
				</Button>
			}
			style={{ maxWidth: 300 }}
			onClick={handleViewImage}
		>
			<div className="cardContent">
				<PictureOutlined rev={undefined} />
			</div>
		</Card>
	);
});

export default ViewImageCard;
