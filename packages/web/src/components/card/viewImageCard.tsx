import React, { useImperativeHandle, forwardRef } from "react";
import { useTranslation } from "react-i18next";
import { PictureOutlined } from "@ant-design/icons";
import { Button, Card, Upload } from "antd";
import type { UploadProps } from "antd/es/upload/interface";

const ViewImageCard = forwardRef((props: any, ref: any) => {
	useImperativeHandle(ref, () => ({
		handleViewImage,
	}));

	const { t } = useTranslation();

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

	return (
		<Upload {...uploadProps}>
			<Card
				// title={t("home.viewImage")}
				hoverable
				bordered={false}
				// extra={
				// 	<Button type="link" onClick={handleViewImage}>
				// 		{t("home.history")}
				// 	</Button>
				// }
				style={{ maxWidth: 300, height: 145 }}
			>
				<div className="cardContent">
					<PictureOutlined rev={undefined} />
					<div className="cardTitle">{t("home.viewImage")}</div>
				</div>
			</Card>
		</Upload>
	);
});

export default ViewImageCard;
