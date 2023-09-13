import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, InputNumber } from "antd";
import {
	PushpinOutlined,
	MinusOutlined,
	BorderOutlined,
	BlockOutlined,
	CloseOutlined,
	SettingOutlined,
} from "@ant-design/icons";
import ininitApp from "../../pages/main";
import styles from "./index.module.scss";

const ClipScreen = () => {
	const { t } = useTranslation();
	const [isPlay, setIsPlay] = useState(false);
	useEffect(() => {
		window.electronAPI?.handleCsSetIsPlay((e: any, isPlay: boolean) => {
			setIsPlay(isPlay);
		});
	}, []);

	async function handleCloseWin() {
		window.electronAPI?.sendCsCloseWin();
	}

	async function handleHideWin() {
		window.electronAPI?.sendCsHideWin();
	}

	function handleMinimizeWin() {
		window.electronAPI?.sendCsMinimizeWin();
	}

	return (
		<div id="clipScreen" className={styles.clipScreen}>
			<div className="header">
				{isPlay ? (
					<></>
				) : (
					<div className="right">
						<Button
							type="text"
							icon={<MinusOutlined rev={undefined} />}
							title={t("nav.minimize")}
							onClick={handleMinimizeWin}
						/>
						<Button
							type="text"
							icon={<CloseOutlined rev={undefined} />}
							title={t("nav.close")}
							onClick={handleCloseWin}
						/>
					</div>
				)}
			</div>
		</div>
	);
};

ininitApp(ClipScreen);
export default ClipScreen;
