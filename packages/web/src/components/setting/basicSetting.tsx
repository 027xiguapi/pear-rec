import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Switch, Form, Input, Select } from "antd";

const { TextArea } = Input;
const BasicSetting = () => {
	const { t, i18n } = useTranslation();
	const [form] = Form.useForm();

	useEffect(() => {
		init();
	}, []);

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
		const filePath = window.electronAPI
			? await window.electronAPI?.invokeSeGetFilePath()
			: t("setting.download");
		form.setFieldValue("filePath", filePath);
	}

	function getLanguage() {
		const lng = localStorage.getItem("pear-rec_i18n");
		form.setFieldValue("language", lng);
	}

	function handleSetOpenAtLogin(isOpen: boolean) {
		window.electronAPI?.sendSeSetOpenAtLogin(isOpen);
	}

	async function getOpenAtLogin() {
		let options = await window.electronAPI?.invokeSeGetOpenAtLogin();
		form.setFieldValue("openAtLogin", options?.openAtLogin);
	}

	function handleChangeLanguage(lng: string) {
		localStorage.setItem("pear-rec_i18n", lng);
		i18n.changeLanguage(lng);
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
