import React, { useEffect, useRef, useState } from "react";
import { Switch, Form, Input } from "antd";
import { ipcRenderer } from "electron";

const { TextArea } = Input;
const BasicSetting = () => {
	const [form] = Form.useForm();

	useEffect(() => {
		getFilePath();
		getOpenAtLogin();
	}, []);

	async function handleSetFilePath() {
		const filePath = await ipcRenderer.invoke("se:set-filePath");
		filePath && form.setFieldValue("filePath", filePath);
	}

	async function getFilePath() {
		const filePath = await ipcRenderer.invoke("se:get-filePath");
		form.setFieldValue("filePath", filePath);
	}

	function handleSetOpenAtLogin(isOpen: boolean) {
		ipcRenderer.send("se:set-openAtLogin", isOpen);
	}

	async function getOpenAtLogin() {
		let options = await ipcRenderer.invoke("se:get-openAtLogin");
		form.setFieldValue("openAtLogin", options.openAtLogin);
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
