import React, { useState } from "react";
import {
	MinusOutlined,
	BorderOutlined,
	CloseOutlined,
} from "@ant-design/icons";
import { ipcRenderer } from "electron";
import "./index.scss";

const Header = () => {
	async function handleHideWin() {
		ipcRenderer.send("ma:minimize-win");
	}

	function handleCloseWin() {
		ipcRenderer.send("ma:hide-win");
	}

	return (
		<div className="header">
			<div className="left">
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
