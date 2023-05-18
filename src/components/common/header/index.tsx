import React, { useState } from "react";
import {
	MinusOutlined,
	BorderOutlined,
	CloseOutlined,
} from "@ant-design/icons";
import { Button } from "antd";
import { ipcRenderer } from "electron";
import "./index.scss";
import logo from "@/assets/imgs/logo.ico";

const Header = () => {
	async function handleHideWin() {
		ipcRenderer.send("ma:minimize-win");
	}

	function handleCloseWin() {
		ipcRenderer.send("ma:hide-win");
	}

	function handleOpenView() {
		ipcRenderer.send("vv:open-win");
	}

	return (
		<div className="header">
			<div className="left">
				<img className="logo" src={logo} alt="logo" />
				<span>REC</span>
			</div>
			<div className="drgan"></div>
			<div className="right">
				<Button
					type="text"
					icon={<MinusOutlined />}
					title="最小化"
					onClick={handleHideWin}
				/>
				<Button
					type="text"
					icon={<CloseOutlined />}
					title="关闭"
					onClick={handleCloseWin}
				/>
			</div>
		</div>
	);
};

export default Header;
