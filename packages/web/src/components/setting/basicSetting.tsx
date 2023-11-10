import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Switch, Form, Input, Select } from "antd";
import { useSettingApi } from "../../api/setting";
import { Local } from "../../util/storage";

const { TextArea } = Input;
const BasicSetting = (props) => {
	const settingApi = useSettingApi();
	const { t, i18n } = useTranslation();
	const [form] = Form.useForm();
	const { user, setting } = props;

	useEffect(() => {
		setting.id && init();
	}, [setting]);

	function init() {
		getLanguage();
		getFilePath();
		getOpenAtLogin();
	}

	async function handleSetFilePath() {
		const filePath = await window.electronAPI?.invokeSeSetFilePath();
		filePath && form.setFieldValue("filePath", filePath);
		settingApi.editSetting(setting.id, { filePath: filePath || "" });
	}

	async function getFilePath() {
		const filePath = setting.filePath || t("setting.download");
		form.setFieldValue("filePath", filePath);
	}

	function getLanguage() {
		const lng = setting.language || Local.get("i18n") || "zh";
		form.setFieldValue("language", lng);
	}

	function handleSetOpenAtLogin(isOpen: boolean) {
		settingApi.editSetting(setting.id, { openAtLogin: isOpen });
	}

	async function getOpenAtLogin() {
		console.log(setting);
		const openAtLogin = setting.openAtLogin || false;
		form.setFieldValue("openAtLogin", openAtLogin);
	}

	function handleChangeLanguage(lng: string) {
		Local.set("i18n", lng);
		i18n.changeLanguage(lng);
		settingApi.editSetting(setting.id, { language: lng });
		window.electronAPI?.sendSeSetLanguage(lng);
	}

	return (
		<div className="basicForm">
			<Form
				form={form}
				initialValues={{
					layout: "horizontal",
				}}
			>
				<Form.Item label={t("setting.language")} name="language">
					<Select
						style={{ width: 120 }}
						onChange={handleChangeLanguage}
						options={[
							{ value: "zh", label: "中文" },
							{ value: "en", label: "EN" },
							{ value: "de", label: "Deutsch" },
						]}
					/>
				</Form.Item>
				<Form.Item label={t("setting.filePath")} name="filePath">
					<TextArea
						className="filePathInput"
						readOnly
						onClick={handleSetFilePath}
						rows={3}
					/>
				</Form.Item>
				<Form.Item
					label={t("setting.openAtLogin")}
					name="openAtLogin"
					valuePropName="checked"
				>
					<Switch
						checkedChildren={t("setting.open")}
						unCheckedChildren={t("setting.close")}
						onChange={handleSetOpenAtLogin}
					/>
				</Form.Item>
			</Form>
		</div>
	);
};

export default BasicSetting;
