import React, { useEffect, useRef, useState } from "react";
import { Button, InputNumber } from "antd";
import {
	PushpinOutlined,
	MinusOutlined,
	BorderOutlined,
	BlockOutlined,
	CloseOutlined,
	SettingOutlined,
} from "@ant-design/icons";
import styles from "./index.module.scss";

const ClipScreen = () => {
	const [isPlay, setIsPlay] = useState(false);
	useEffect(() => {
		window.electronAPI?.handleCsSetIsPlay((event, isPlay) => {
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
							title="最小化"
							onClick={handleMinimizeWin}
						/>
						<Button
							type="text"
							icon={<CloseOutlined rev={undefined} />}
							title="关闭"
							onClick={handleCloseWin}
						/>
					</div>
				)}
			</div>
		</div>
	);
};

export default ClipScreen;
