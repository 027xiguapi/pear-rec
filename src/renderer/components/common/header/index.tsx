import React, { useState } from "react";
import {
	MinusOutlined,
	BorderOutlined,
	CloseOutlined,
} from "@ant-design/icons";
import { Button } from "antd";
import { IpcEvents } from "@/ipcEvents";
import "./index.scss";

const Header = () => {
	async function handleHideWin() {
		window.electronAPI?.ipcRenderer.send(IpcEvents.EV_HIDE_MAIN_WIN);
	}

	function handleCloseWin() {
		window.electronAPI?.ipcRenderer.send(IpcEvents.EV_CLOSE_MAIN_WIN);
	}

	function handleGoWin() {
		window.electronAPI?.ipcRenderer.send(IpcEvents.EV_OPEN_VIEW_IMAGE_WIN);
	}

	return (
		<div className="header">
			<div className="left">
				<Button onClick={handleGoWin}>图片</Button>
				<span>REC</span>
			</div>
			<div className="drgan"></div>
			<div className="right">
				<MinusOutlined className="icon-s" onClick={handleHideWin} />
				<CloseOutlined className="icon-s" onClick={handleCloseWin} />
			</div>
		</div>
	);
};

export default Header;
