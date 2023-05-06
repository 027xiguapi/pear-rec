import React, { useState } from "react";
import {
	PushpinOutlined,
	MinusOutlined,
	BorderOutlined,
	BlockOutlined,
	CloseOutlined,
} from "@ant-design/icons";
import { Button } from "antd";
import { ipcRenderer } from "electron";
import "./index.scss";

const WinBar = () => {
	const [isMaximize, setIsMaximize] = useState(false);
	const [isAlwaysOnTop, setIsAlwaysOnTop] = useState(false);

	async function handleHideWin() {
		ipcRenderer.send("vi:hide-win");
	}

	function handleMinimizeWin() {
		ipcRenderer.send("vi:minimize-win");
	}

	function handleMaximizeWin() {
		ipcRenderer.send("vi:maximize-win");
		setIsMaximize(true);
	}

	function handleUnmaximizeWin() {
		ipcRenderer.send("vi:unmaximize-win");
		setIsMaximize(false);
	}

	function handleToggleMaximizeWin() {
		isMaximize ? handleUnmaximizeWin() : handleMaximizeWin();
	}

	function handleToggleAlwaysOnTopWin() {
		const _isAlwaysOnTop = !isAlwaysOnTop;
		setIsAlwaysOnTop(_isAlwaysOnTop);
		ipcRenderer.send("vi:set-always-on-top", _isAlwaysOnTop);
	}

	return (
		<div className="winBar">
			<Button
				type="text"
				icon={<PushpinOutlined />}
				className={`toolbarIcon ${isAlwaysOnTop ? "active" : ""}`}
				title="置顶"
				onClick={() => handleToggleAlwaysOnTopWin()}
			/>
			<Button
				type="text"
				icon={<MinusOutlined />}
				className="toolbarIcon"
				title="最小化"
				onClick={() => handleMinimizeWin()}
			/>
			<Button
				type="text"
				icon={isMaximize ? <BlockOutlined /> : <BorderOutlined />}
				className="toolbarIcon"
				title={isMaximize ? "向下还原" : "最大化"}
				onClick={() => handleToggleMaximizeWin()}
			/>
			<Button
				type="text"
				icon={<CloseOutlined />}
				className="toolbarIcon"
				title="关闭"
				onClick={() => handleHideWin()}
			/>
		</div>
	);
};

export default WinBar;
