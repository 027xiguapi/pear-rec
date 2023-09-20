import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, Switch, Form, Input, Tabs } from "antd";
import type { TabsProps } from "antd";
import UserSetting from "../../components/setting/userSetting";
import BasicSetting from "../../components/setting/basicSetting";
import ininitApp from "../../pages/main";
import { useUserApi } from "../../api/user";
import styles from "./index.module.scss";

const Setting = () => {
	const userApi = useUserApi();
	const { t } = useTranslation();
	const [user, setUser] = useState({});
	const [setting, setSetting] = useState({});

	useEffect(() => {
		getCurrentUser();
	}, []);

	const items = [
		{
			key: "userSetting",
			label: t("setting.userSetting"),
			children: UserSetting,
		},
		{
			key: "basicSetting",
			label: t("setting.basicSetting"),
			children: BasicSetting,
			forceRender: true,
		},
	];

	async function getCurrentUser() {
		const res = (await userApi.getCurrentUser()) as any;
		if (res.code == 0) {
			setUser(res.data);
		}
	}

	return (
		<div
			className={`${styles.setting} ${
				window.isElectron ? styles.electron : styles.web
			}`}
		>
			<Tabs
				tabPosition="left"
				items={items.map((tab, i) => {
					return {
						label: tab.label,
						key: tab.key,
						children: <tab.children user={user} />,
						forceRender: tab.forceRender,
					};
				})}
			/>
		</div>
	);
};

ininitApp(Setting);

export default Setting;
