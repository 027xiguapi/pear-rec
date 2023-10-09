import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Switch, Form, Input, Select } from "antd";
import { useUserApi } from "../../api/user";

const { TextArea } = Input;
const BasicSetting = (props) => {
	const userApi = useUserApi();
	const { t, i18n } = useTranslation();
	const [form] = Form.useForm();
	const { user } = props;

	useEffect(() => {
		init();
	}, [user]);

	function init() {
		getFilePath();
		getOpenAtLogin();
		getLanguage();
	}

	async function handleSetFilePath() {
		const filePath = await window.electronAPI?.invokeSeSetFilePath();
		filePath && form.setFieldValue("filePath", filePath);
	}

	async function getFilePath() {
		const filePath = user.filePath || t("setting.download");
		form.setFieldValue("filePath", filePath);
	}

	function getLanguage() {
		const lng = user.language || localStorage.getItem("pear-rec_i18n");
		form.setFieldValue("language", lng);
	}

	function handleSetOpenAtLogin(isOpen: boolean) {
		userApi.editUser(user.id, { ...user, openAtLogin: isOpen });
	}

	async function getOpenAtLogin() {
		const openAtLogin = user.openAtLogin || false;
		form.setFieldValue("openAtLogin", openAtLogin);
	}

	function handleChangeLanguage(lng: string) {
		localStorage.setItem("pear-rec_i18n", lng);
		i18n.changeLanguage(lng);
		userApi.editUser(user.id, { ...user, language: lng });
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
