import React, { useState } from "react";
import {
	MinusOutlined,
	SettingOutlined,
	CloseOutlined,
} from "@ant-design/icons";
import { Button } from "antd";
import styles from "./index.module.scss";

const logo = "/imgs/logo/logo.ico";
const Header = () => {
	async function handleHideWin() {
		window.electronAPI?.sendMaMinimizeWin();
	}

	function handleCloseWin() {
		window.electronAPI?.sendMaHideWin();
	}

	function handleOpenSettingWin() {
		window.electronAPI
			? window.electronAPI.sendSeOpenWin()
			: (location.href = "/setting.html");
	}

	return (
		<div className={styles.header}>
			<div className="left">
				<img className="logo" src={logo} alt="logo" />
				<span>REC</span>
			</div>
			<div className="drgan"></div>
			<div className="right">
				<Button
					type="text"
					icon={<SettingOutlined rev={undefined} />}
					title="设置"
					onClick={handleOpenSettingWin}
				/>
				<Button
					type="text"
					icon={<MinusOutlined rev={undefined} />}
					title="最小化"
					onClick={handleHideWin}
				/>
				<Button
					type="text"
					icon={<CloseOutlined rev={undefined} />}
					title="关闭"
					onClick={handleCloseWin}
				/>
			</div>
		</div>
	);
};

export default Header;
