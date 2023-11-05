import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocalStorage } from 'react-use';
import { Switch, Form, Input, Select } from "antd";
import { useUserApi } from "../../api/user";
import { Local } from "../../util/storage";

const { TextArea } = Input;
const BasicSetting = (props) => {
  const userApi = useUserApi();
  const { t, i18n } = useTranslation();
  const [server, setServer] = useLocalStorage(Local.setKey('server'), Local.get('server') || { openServer: false, serverPath: "http://localhost:5000/" });
  const [form] = Form.useForm();
  const { user } = props;

  useEffect(() => {
    init();
  }, [user]);

  function init() {
    getServerPath();
    getOpenAtLogin();
  }

  async function handleSetServerPath(e) {
    const serverPath = e.target.value;
    userApi.editUser(user.id, { ...user, serverPath: serverPath });
    setServer({ openServer: server.openServer, serverPath: serverPath });
  }

  async function getServerPath() {
    const serverPath = user.serverPath || server.serverPath || "http://localhost:5000/";
    form.setFieldValue("serverPath", serverPath);
  }

  function handleSetOpenServer(isOpen: boolean) {
    userApi.editUser(user.id, { ...user, openServer: isOpen });
    setServer({ openServer: isOpen, serverPath: server.serverPath });
  }

  async function getOpenAtLogin() {
    const openServer = user.openServer || server.openServer || false;
    form.setFieldValue("openServer", openServer);
  }

  return (
    <div className="basicForm">
      <Form
        form={form}
        initialValues={{
          layout: "horizontal",
        }}
      >
        <Form.Item
          label={t("setting.openServer")}
          name="openServer"
          valuePropName="checked"
        >
          <Switch
            checkedChildren={t("setting.open")}
            unCheckedChildren={t("setting.close")}
            onChange={handleSetOpenServer}
          />
        </Form.Item>
        <Form.Item label={t("setting.serverPath")} name="serverPath">
          <TextArea
            className="serverPathInput"
            onChange={handleSetServerPath}
            rows={3}
          />
        </Form.Item>

      </Form>
    </div>
  );
};

export default BasicSetting;
