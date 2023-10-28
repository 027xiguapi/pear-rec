import React, { useImperativeHandle, forwardRef, useRef } from "react";
import { useTranslation } from "react-i18next";
import { BsMusicNoteBeamed } from "react-icons/bs";
import type { MenuProps } from "antd";
import { DownOutlined } from "@ant-design/icons";
import { Space, Card, Dropdown, Modal } from "antd";

const ViewAudioCard = forwardRef((props: any, ref: any) => {
	useImperativeHandle(ref, () => ({
		handleViewAudio,
	}));

	const { t } = useTranslation();
	const fileRef = useRef(null);
	const directoryRef = useRef(null);

	function handleViewAudio(e: any) {
		window.electronAPI
			? window.electronAPI.sendVaOpenWin()
			: (location.href = "/viewAudio.html");
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
			label: "打开音频",
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
			window.electronAPI.sendVaOpenWin({ url: file.path });
		} else {
			const url = window.URL.createObjectURL(file);
			Modal.confirm({
				title: "提示",
				content: `是否打开${file.name}`,
				okText: t("modal.ok"),
				cancelText: t("modal.cancel"),
				onOk() {
					window.open(`/viewAudio.html?audioUrl=${encodeURIComponent(url)}`);
				}
			});
		}
    event.target.value = "";
	}

	function handleUploadDirectory(event) {
		const file = event.target.files[0];
		if (window.electronAPI) {
			window.electronAPI.sendVaOpenWin({ imgUrl: file.path });
		}
    event.target.value = "";
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
						<BsMusicNoteBeamed className="cardIcon" onClick={()=>fileRef.current.click()} />
						<DownOutlined className="cardToggle" />
					</Space>
				</Dropdown>
				<div className="cardTitle">{t("home.playAudio")}</div>
			</div>
			<input
				type="file"
				ref={fileRef}
				accept="audio/*"
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

export default ViewAudioCard;
