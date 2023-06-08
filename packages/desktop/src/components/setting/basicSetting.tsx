import React, { useEffect, useRef, useState } from "react";
import { Switch, Form, Input } from "antd";

const { TextArea } = Input;
const BasicSetting = () => {
	const [form] = Form.useForm();

	useEffect(() => {
		getFilePath();
		getOpenAtLogin();
	}, []);

	async function handleSetFilePath() {
		const filePath = await window.electronAPI?.invokeSeSetFilePath();
		filePath && form.setFieldValue("filePath", filePath);
	}

	async function getFilePath() {
		const filePath = await window.electronAPI?.invokeSeGetFilePath();
		form.setFieldValue("filePath", filePath);
	}

	function handleSetOpenAtLogin(isOpen: boolean) {
		window.electronAPI?.sendSeSetOpenAtLogin(isOpen);
	}

	async function getOpenAtLogin() {
		let options = await window.electronAPI?.invokeSeGetOpenAtLogin();
		form.setFieldValue("openAtLogin", options?.openAtLogin);
	}

	return (
		<div className="basicForm">
			<Form
				form={form}
				initialValues={{
					layout: "horizontal",
				}}
			>
				<Form.Item label="保存地址" name="filePath">
					<TextArea
						className="filePathInput"
						readOnly
						onClick={handleSetFilePath}
						rows={3}
					/>
				</Form.Item>
				<Form.Item
					label="开机自启动"
					name="openAtLogin"
					valuePropName="checked"
				>
					<Switch
						checkedChildren="开启"
						unCheckedChildren="关闭"
						onChange={handleSetOpenAtLogin}
					/>
				</Form.Item>
			</Form>
		</div>
	);
};

export default BasicSetting;
