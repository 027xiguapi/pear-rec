import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocalStorage } from 'react-use';
import { Button, Switch, Form, Input, Tabs } from "antd";
import UserSetting from "../../components/setting/userSetting";
import BasicSetting from "../../components/setting/basicSetting";
import ServerSetting from "../../components/setting/serverSetting";
import ininitApp from "../../pages/main";
import { useUserApi } from "../../api/user";
import styles from "./index.module.scss";

const Setting = () => {
	const userApi = useUserApi();
	const { t } = useTranslation();
	const [user, setUser] = useState({} as any);
  const [value, setValue] = useLocalStorage('pear-rec:user', '');

	useEffect(() => {
		window.isOffline || user.id || getCurrentUser();
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
    {
			key: "serverSetting",
			label: "服务设置",
			children: ServerSetting,
      forceRender: true,
		},
	];

	async function getCurrentUser() {
		const res = (await userApi.getCurrentUser()) as any;
		if (res.code == 0) {
			setUser(res.data);
      setValue(res.data);
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
