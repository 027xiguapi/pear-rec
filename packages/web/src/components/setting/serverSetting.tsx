import { Button, Form, Input, Switch } from 'antd';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { db } from '../../db';

const { TextArea } = Input;
const BasicSetting = (props) => {
  const { t, i18n } = useTranslation();
  const [form] = Form.useForm();
  const { user, setting } = props;

  useEffect(() => {
    setting.id && init();
  }, [setting]);

  function init() {
    getServerPath();
    getOpenServer();
  }

  async function handleSetServerPath(e) {
    const serverPath = e.target.value;
    db.settings.update(setting.id, { serverPath: serverPath });
  }

  async function getServerPath() {
    const serverPath = setting.serverPath || 'http://localhost:9190/';
    form.setFieldValue('serverPath', serverPath);
  }

  function handleSetOpenServer(isOpen: boolean) {
    db.settings.update(setting.id, { openServer: isOpen });
  }

  async function getOpenServer() {
    const openAtLogin = setting.openAtLogin || false;
    form.setFieldValue('openAtLogin', openAtLogin);
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
        {t('setting.address')}:<Button type="link">https://github.com/027xiguapi/pear-rec</Button>
      </p>
    </div>
  );
};

export default BasicSetting;
