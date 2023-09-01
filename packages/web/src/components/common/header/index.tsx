import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
	MinusOutlined,
	SettingOutlined,
	CloseOutlined,
} from "@ant-design/icons";
import { Button } from "antd";
import styles from "./index.module.scss";

const logo = "./imgs/icons/png/512x512.png";
const Header = () => {
	const { t } = useTranslation();
	async function handleHideWin() {
		window.electronAPI?.sendMaMinimizeWin();
	}

	function handleCloseWin() {
		window.electronAPI?.sendMaHideWin();
	}

	function handleOpenSettingWin() {
		window.electronAPI
			? window.electronAPI.sendSeOpenWin()
			: window.open("/setting.html");
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
					title={t("nav.setting")}
					onClick={handleOpenSettingWin}
				/>
				<Button
					type="text"
					icon={<MinusOutlined rev={undefined} />}
					title={t("nav.minimize")}
					onClick={handleHideWin}
				/>
				<Button
					type="text"
					icon={<CloseOutlined rev={undefined} />}
					title={t("nav.close")}
					onClick={handleCloseWin}
				/>
			</div>
		</div>
	);
};

export default Header;
