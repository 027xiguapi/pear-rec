import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Switch, Form, Input } from 'antd';
import { useSettingApi } from '../../api/setting';
import { Local } from '../../util/storage';

const { TextArea } = Input;
const BasicSetting = (props) => {
  const settingApi = useSettingApi();
  const { t, i18n } = useTranslation();
  const [server, setServer] = useState(
    Local.get('server') || {
      openServer: false,
      serverPath: 'http://localhost:9190/',
    },
  );
  const [form] = Form.useForm();
  const { user, setting } = props;

  useEffect(() => {
    setting.id && init();
  }, [setting]);

  function init() {
    getServerPath();
    getOpenAtLogin();
  }

  async function handleSetServerPath(e) {
    const serverPath = e.target.value;
    settingApi.editSetting(setting.id, { serverPath: serverPath });
    setServer({ openServer: server.openServer, serverPath: serverPath });
    Local.set('server', {
      openServer: server.openServer,
      serverPath: serverPath,
    });
  }

  async function getServerPath() {
    const serverPath = setting.serverPath || server.serverPath || 'http://localhost:9190/';
    form.setFieldValue('serverPath', serverPath);
  }

  function handleSetOpenServer(isOpen: boolean) {
    setServer({ openServer: isOpen, serverPath: server.serverPath });
    Local.set('server', {
      openServer: isOpen,
      serverPath: server.serverPath,
    });
  }

  async function getOpenAtLogin() {
    const openServer = server.openServer || false;
    form.setFieldValue('openServer', openServer);
  }

  function handleTipClick() {
    window.open('https://github.com/027xiguapi/pear-rec');
  }

  return (
    <div className="basicForm">
      <Form
        form={form}
        initialValues={{
          layout: 'horizontal',
        }}
      >
        <Form.Item label={t('setting.openServer')} name="openServer" valuePropName="checked">
          <Switch
            checkedChildren={t('setting.open')}
            unCheckedChildren={t('setting.close')}
            onChange={handleSetOpenServer}
          />
        </Form.Item>
        <Form.Item label={t('setting.serverPath')} name="serverPath">
          <TextArea className="serverPathInput" onChange={handleSetServerPath} rows={3} />
        </Form.Item>
      </Form>

      <p className="tip" onClick={handleTipClick}>
        {t('setting.address')}: https://github.com/027xiguapi/pear-rec
      </p>
    </div>
  );
};

export default BasicSetting;
