import React, { useImperativeHandle, forwardRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { PictureOutlined, DownOutlined } from "@ant-design/icons";
import { Space, Card, Upload } from "antd";
import type { UploadProps } from "antd/es/upload/interface";

const ViewImageCard = forwardRef((props: any, ref: any) => {
	useImperativeHandle(ref, () => ({
		handleViewImage,
	}));

	const { t } = useTranslation();
	const [isHistory, setIsHistory] = useState(false);

	const uploadProps: UploadProps = {
		accept: "image/png,image/jpeg,.webp",
		name: "file",
		multiple: false,
		showUploadList: false,
		customRequest: () => {},
		beforeUpload: (file) => {
			if (window.electronAPI) {
				window.electronAPI.sendViOpenWin({ imgUrl: file.path });
			} else {
				const imgUrl = window.URL.createObjectURL(file);
				window.open(`/viewImage.html?imgUrl=${encodeURIComponent(imgUrl)}`);
			}
			return false;
		},
	};

	function handleViewImage(e: any) {
		window.electronAPI
			? window.electronAPI.sendViOpenWin()
			: (location.href = "/viewImage.html");
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
						<PictureOutlined className="cardIcon" onClick={handleViewImage} />
					) : (
						<Upload {...uploadProps}>
							<PictureOutlined className="cardIcon" />
						</Upload>
					)}
					<DownOutlined className="cardToggle" onClick={handleToggle} />
				</Space>
				<div className="cardTitle">
					{isHistory ? t("home.history") : t("home.viewImage")}
				</div>
			</div>
		</Card>
	);
});

export default ViewImageCard;
