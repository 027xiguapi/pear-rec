import React, { useState, useRef, useEffect } from "react";
import {
	PushpinOutlined,
	MinusOutlined,
	BorderOutlined,
	BlockOutlined,
	CloseOutlined,
} from "@ant-design/icons";
import { Button } from "antd";
import Stopwatch from "@/components/timer/stopwatch";
import { ipcRenderer } from "electron";
import "./index.scss";

const RecordAudio = () => {
	async function handleCloseWin() {
		ipcRenderer.send("ra:close-win");
	}

	async function handleHideWin() {
		ipcRenderer.send("ra:hide-win");
	}

	function handleMinimizeWin() {
		ipcRenderer.send("ra:minimize-win");
	}

	return (
		<div className="recordAudio">
			<Stopwatch />

			<div className="winBar">
				<Button
					type="text"
					icon={<MinusOutlined />}
					className="toolbarIcon"
					title="最小化"
					onClick={() => handleMinimizeWin()}
				/>
				<Button
					type="text"
					icon={<CloseOutlined />}
					className="toolbarIcon"
					title="关闭"
					onClick={() => handleCloseWin()}
				/>
			</div>
		</div>
	);
};

export default RecordAudio;
