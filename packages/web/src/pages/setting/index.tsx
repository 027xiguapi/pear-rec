import React, { useEffect, useRef, useState } from "react";
import { Button, Switch, Form, Input, Tabs } from "antd";
import type { TabsProps } from "antd";
import UserSetting from "@/components/setting/userSetting";
import BasicSetting from "@/components/setting/basicSetting";
import styles from "./index.module.scss";

const Setting = () => {
	const items: TabsProps["items"] = [
		{
			key: "userSetting",
			label: `账户设置`,
			children: UserSetting(),
		},
		{
			key: "basicSetting",
			label: `通用设置`,
			children: BasicSetting(),
			forceRender: true,
		},
	];

	return (
		<div
			className={`${styles.setting} ${
				window.isElectron ? styles.electron : styles.web
			}`}
		>
			<Tabs tabPosition="left" items={items} />
		</div>
	);
};

export default Setting;
