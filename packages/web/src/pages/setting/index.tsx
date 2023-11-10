import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Tabs } from "antd";
import UserSetting from "../../components/setting/userSetting";
import BasicSetting from "../../components/setting/basicSetting";
import ServerSetting from "../../components/setting/serverSetting";
import ininitApp from "../../pages/main";
import { useUserApi } from "../../api/user";
import { useSettingApi } from "../../api/setting";
import { Local } from "../../util/storage";
import styles from "./index.module.scss";

const Setting = () => {
	const userApi = useUserApi();
	const settingApi = useSettingApi();
	const { t } = useTranslation();
	const [setting, setSetting] = useState({} as any);
	const [user, setUser] = useState(Local.get("user") || ({} as any));

	useEffect(() => {
		if (user.id) {
			getSetting(user.id);
		} else {
			window.isOffline || getCurrentUser();
		}
	}, [user]);

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
			const user = res.data;
			setUser(user);
			Local.set("user", user);
		}
	}

	async function getSetting(userId) {
		const res = (await settingApi.getSetting(userId)) as any;
		if (res.code == 0) {
			setSetting(res.data || {});
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
						children: <tab.children user={user} setting={setting} />,
						forceRender: tab.forceRender,
					};
				})}
			/>
		</div>
	);
};

ininitApp(Setting);

export default Setting;
