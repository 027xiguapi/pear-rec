import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, Switch, Form, Input, Tabs } from "antd";
import type { TabsProps } from "antd";
import UserSetting from "../../components/setting/userSetting";
import BasicSetting from "../../components/setting/basicSetting";
import ininitApp from "../../pages/main";
import styles from "./index.module.scss";

const Setting = () => {
	const { t } = useTranslation();
	const items: TabsProps["items"] = [
		{
			key: "userSetting",
			label: t("setting.userSetting"),
			children: UserSetting(),
		},
		{
			key: "basicSetting",
			label: t("setting.basicSetting"),
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

ininitApp(Setting);

export default Setting;
