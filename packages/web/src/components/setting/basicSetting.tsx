import { FolderOpenOutlined } from '@ant-design/icons';
import { Button, Form, Input, Select, Switch } from 'antd';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { db } from '../../db';
import { Local } from '../../util/storage';

const { TextArea } = Input;
const BasicSetting = (props) => {
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
    const filePath = await window.electronAPI?.invokeSeSetFilePath(setting.filePath);
    filePath && form.setFieldValue('filePath', filePath);
    db.settings.update(setting.id, { filePath: filePath || '' });
  }

  function handleOpenFilePath() {
    // setting.filePath && api.getFolder(form.getFieldValue('filePath'));
  }

  async function getFilePath() {
    const filePath = setting.filePath || t('setting.download');
    form.setFieldValue('filePath', filePath);
  }

  function getLanguage() {
    const lng = setting.language || Local.get('i18n') || 'zh';
    form.setFieldValue('language', lng);
  }

  function handleSetOpenAtLogin(isOpen: boolean) {
    db.settings.update(setting.id, { openAtLogin: isOpen });
  }

  async function getOpenAtLogin() {
    const openAtLogin = setting.openAtLogin || false;
    form.setFieldValue('openAtLogin', openAtLogin);
  }

  function handleChangeLanguage(lng: string) {
    Local.set('i18n', lng);
    i18n.changeLanguage(lng);
    db.settings.update(setting.id, { language: lng });
    window.electronAPI?.sendSeSetLanguage(lng);
  }

  return (
    <div className="basicForm">
      <Form
        form={form}
        initialValues={{
          layout: 'horizontal',
        }}
      >
        <Form.Item label={t('setting.language')} name="language">
          <Select
            style={{ width: 120 }}
            onChange={handleChangeLanguage}
            options={[
              { value: 'zh', label: '中文' },
              { value: 'en', label: 'EN' },
              { value: 'de', label: 'Deutsch' },
            ]}
          />
        </Form.Item>
        <Form.Item label={t('setting.filePath')} name="filePath">
          <TextArea className="filePathInput" readOnly onClick={handleSetFilePath} rows={3} />
        </Form.Item>
        <Form.Item label={t('setting.openFilePath')}>
          <Button icon={<FolderOpenOutlined />} onClick={handleOpenFilePath}>
            打开
          </Button>
        </Form.Item>
        <Form.Item label={t('setting.openAtLogin')} name="openAtLogin" valuePropName="checked">
          <Switch
            checkedChildren={t('setting.open')}
            unCheckedChildren={t('setting.close')}
            onChange={handleSetOpenAtLogin}
          />
        </Form.Item>
      </Form>
    </div>
  );
};

export default BasicSetting;
