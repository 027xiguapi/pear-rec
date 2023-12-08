import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Switch, Form, Input } from 'antd';
import { useSettingApi } from '../../api/setting';

const ShortcutSetting = (props) => {
  const settingApi = useSettingApi();
  const { t, i18n } = useTranslation();
  const [form] = Form.useForm();
  const { user, setting } = props;

  return (
    <div className="shortcutSetting">
      <Form
        form={form}
        initialValues={{
          layout: 'horizontal',
        }}
      >
        <Form.Item label={t('home.screenshot')} name="screenshot">
          <Input className="screenshotInput" defaultValue={'Alt+Shift+q'} disabled />
        </Form.Item>
        <Form.Item label={t('home.videoRecording')} name="videoRecording">
          <Input className="videoRecordingInput" defaultValue={'Alt+Shift+v'} disabled />
        </Form.Item>
        <Form.Item label={t('home.screenRecording')} name="screenRecording">
          <Input className="screenRecordingInput" defaultValue={'Alt+Shift+s'} disabled />
        </Form.Item>
        <Form.Item label={t('home.audioRecording')} name="audioRecording">
          <Input className="audioRecordingInput" defaultValue={'Alt+Shift+a'} disabled />
        </Form.Item>
      </Form>
    </div>
  );
};

export default ShortcutSetting;
