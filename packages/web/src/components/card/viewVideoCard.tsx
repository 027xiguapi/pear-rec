import React, { useImperativeHandle, forwardRef, useRef } from "react";
import { useTranslation } from "react-i18next";
import { PlayCircleOutlined, DownOutlined } from "@ant-design/icons";
import { Space, Card, Dropdown } from "antd";
import type { MenuProps } from "antd";

const ViewVideoCard = forwardRef((props: any, ref: any) => {
	useImperativeHandle(ref, () => ({
		handleViewVideo,
	}));

	const { t } = useTranslation();
	const fileRef = useRef(null);
	const directoryRef = useRef(null);

	function handleViewVideo(e: any) {
		window.electronAPI
			? window.electronAPI.sendVvOpenWin()
			: (location.href = "/viewVideo.html");
		e.stopPropagation();
	}

	const onClick: MenuProps["onClick"] = ({ key }) => {
		if (key == "file") {
			fileRef.current.click();
		} else {
			directoryRef.current.click();
		}
	};

	const items: MenuProps["items"] = [
		{
			label: "打开视频",
			key: "file",
		},
		{
			label: "打开文件夹",
			key: "directory",
			disabled: !window.electronAPI,
		},
	];

	function handleUploadFile(event) {
		const file = event.target.files[0];
		if (window.electronAPI) {
			window.electronAPI.sendVvOpenWin({ url: file.path });
		} else {
			const url = window.URL.createObjectURL(file);
			window.open(`/viewVideo.html?videoUrl=${encodeURIComponent(url)}`);
		}
	}

	function handleUploadDirectory(event) {
		console.log(event);
		const file = event.target.files[0];
		if (window.electronAPI) {
			window.electronAPI.sendVvOpenWin({ imgUrl: file.path });
		}
	}

	return (
		<Card
			hoverable
			bordered={false}
			style={{ maxWidth: 300, minWidth: 200, height: 130 }}
		>
			<div className="cardContent">
				<Dropdown menu={{ items, onClick }}>
					<Space>
						<PlayCircleOutlined
							className="cardIcon"
							onClick={handleViewVideo}
						/>
						<DownOutlined className="cardToggle" />
					</Space>
				</Dropdown>
				<div className="cardTitle">{t("home.watchVideo")}</div>
			</div>
			<input
				type="file"
				ref={fileRef}
				accept="video/*"
				className="fileRef"
				onChange={handleUploadFile}
			/>
			<input
				type="file"
				ref={directoryRef}
				directory="directory"
				webkitdirectory="webkitdirectory"
				className="directoryRef"
				onChange={handleUploadDirectory}
			/>
		</Card>
	);
});

export default ViewVideoCard;
