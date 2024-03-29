import { Form, Input, Button, Flex } from 'antd';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { db, defaultShortcut } from '../../db';

let tip = '点击设置快捷键';
const ShortcutSetting = (props) => {
  const { t, i18n } = useTranslation();
  const { user, setting } = props;
  const [form] = Form.useForm();
  const [shortcut, setShortcut] = useState<any>({
    // screenshot: 'Alt+Shift+Q',
    // videoRecording: 'Alt+Shift+V',
    // screenRecording: 'Alt+Shift+S',
    // audioRecording: 'Alt+Shift+A',
  });
  const [screenshotValidate, setScreenshotValidate] = useState<any>({
    validateStatus: 'success',
    errorMsg: '',
  });
  const [videoRecordingValidate, setVideoRecordingValidate] = useState<any>({
    validateStatus: 'success',
    errorMsg: '',
  });
  const [screenRecordingValidate, setScreenRecordingValidate] = useState<any>({
    validateStatus: 'success',
    errorMsg: '',
  });
  const [audioRecordingValidate, setAudioRecordingValidate] = useState<any>({
    validateStatus: 'success',
    errorMsg: '',
  });

  useEffect(() => {
    user.id && getShortcut(user.id);
  }, [user]);

  async function getShortcut(userId) {
    try {
      let shortcut = await db.shortcuts.where({ userId }).first();
      if (!shortcut) {
        shortcut = { userId, createdBy: userId, updatedBy: userId, ...defaultShortcut };
        await db.shortcuts.add(shortcut);
      }
      setShortcut({
        id: shortcut.id,
        screenshot: shortcut.screenshot,
        videoRecording: shortcut.videoRecording,
        screenRecording: shortcut.screenRecording,
        audioRecording: shortcut.audioRecording,
      });
      form.setFieldValue('screenshot', shortcut.screenshot);
      form.setFieldValue('videoRecording', shortcut.videoRecording);
      form.setFieldValue('screenRecording', shortcut.screenRecording);
      form.setFieldValue('audioRecording', shortcut.audioRecording);
    } catch (err) {
      console.log('getSetting', err);
    }
  }

  function setScreenshot(e) {
    const str = getShortKeys(e);
    form.setFieldValue('screenshot', str);
  }

  function setVideoRecording(e) {
    const str = getShortKeys(e);
    form.setFieldValue('videoRecording', str);
  }

  function setScreenRecording(e) {
    const str = getShortKeys(e);
    form.setFieldValue('screenRecording', str);
  }

  function setAudioRecording(e) {
    const str = getShortKeys(e);
    form.setFieldValue('audioRecording', str);
  }

  function handleScreenshotBlur(e) {
    let screenshotValidate = inputValidate('screenshot');
    setScreenshotValidate({ ...screenshotValidate });
  }

  function handleVideoRecordingBlur(e) {
    let videoRecordingValidate = inputValidate('videoRecording');
    setVideoRecordingValidate({ ...videoRecordingValidate });
  }

  function handleScreenRecordingBlur(e) {
    let screenRecordingValidate = inputValidate('screenRecording');
    setScreenRecordingValidate({ ...screenRecordingValidate });
  }

  function handleAudioRecordingBlur(e) {
    let audioRecordingValidate = inputValidate('audioRecording');
    setAudioRecordingValidate({ ...audioRecordingValidate });
  }

  function getShortKeys(e) {
    e.preventDefault();
    // ====== 禁止上下左右按键 =====
    const list = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Backspace', 'Process'];
    if (list.includes(e.key)) return;
    let str = '';
    // 获取用户有没有按下特殊按键【'Control', 'Alt', 'Shift', 'Meta'】
    const auxiliaryKey = [
      e.ctrlKey ? 'Ctrl' : '',
      e.altKey ? 'Alt' : '',
      e.shiftKey ? 'Shift' : '',
      e.metaKey ? '\ue672' : '',
    ].filter((t) => t);
    const someKeys = ['Control', 'Alt', 'Shift', 'Meta'];
    // mac下禁止使用快捷键option
    let publicKey = someKeys.indexOf(e.key) < 0 ? e.key.toLocaleUpperCase() : '';
    if (window.isMac && e.altKey) {
      publicKey = '';
    }
    if (auxiliaryKey.length) {
      str = auxiliaryKey.join('+') + '+' + publicKey;
    } else {
      str = str.substring(0, str.lastIndexOf('+') + 1) + publicKey;
    }
    return str;
  }

  function inputValidate(input) {
    const str = form.getFieldValue(input);
    const formatKeys = str.replace('\ue672', 'CommandOrControl');
    const keyArr = formatKeys.split('+');
    if (formatKeys && keyArr.slice(-1)[0].trim()) {
      let changes = {};
      changes[input] = formatKeys;
      db.shortcuts.update(shortcut.id, changes);
      window.electronAPI?.sendSeSetShortcut({
        name: input,
        key: formatKeys,
        oldKey: shortcut[input],
      });
      return {
        validateStatus: 'success',
        errorMsg: null,
      };
    } else {
      return {
        validateStatus: 'error',
        errorMsg: '设置错误',
      };
    }
  }

  function handleResetClick() {
    db.shortcuts.update(shortcut.id, { ...defaultShortcut });
    form.setFieldValue('screenshot', defaultShortcut.screenshot);
    form.setFieldValue('videoRecording', defaultShortcut.videoRecording);
    form.setFieldValue('screenRecording', defaultShortcut.screenRecording);
    form.setFieldValue('audioRecording', defaultShortcut.audioRecording);
  }

  return (
    <div className="shortcutSetting">
      <Form form={form}>
        <Form.Item
          label={t('home.screenshot')}
          name="screenshot"
          validateStatus={screenshotValidate.validateStatus}
          help={screenshotValidate.errorMsg || tip}
        >
          <Input
            className="screenshotInput"
            onKeyDown={setScreenshot}
            onBlur={handleScreenshotBlur}
          />
        </Form.Item>
        <Form.Item
          label={t('home.videoRecording')}
          name="videoRecording"
          validateStatus={videoRecordingValidate.validateStatus}
          help={videoRecordingValidate.errorMsg || tip}
        >
          <Input
            className="videoRecordingInput"
            onKeyDown={setVideoRecording}
            onBlur={handleVideoRecordingBlur}
          />
        </Form.Item>
        <Form.Item
          label={t('home.screenRecording')}
          name="screenRecording"
          validateStatus={screenRecordingValidate.validateStatus}
          help={screenRecordingValidate.errorMsg || tip}
        >
          <Input
            className="screenRecordingInput"
            onKeyDown={setScreenRecording}
            onBlur={handleScreenRecordingBlur}
          />
        </Form.Item>
        <Form.Item
          label={t('home.audioRecording')}
          name="audioRecording"
          validateStatus={audioRecordingValidate.validateStatus}
          help={audioRecordingValidate.errorMsg || tip}
        >
          <Input
            className="audioRecordingInput"
            onKeyDown={setAudioRecording}
            onBlur={handleAudioRecordingBlur}
          />
        </Form.Item>
        <Flex gap="small" wrap="wrap">
          <Button type="primary" className="resetBtn" danger onClick={handleResetClick}>
            {t('setting.reset')}
          </Button>
        </Flex>
      </Form>
    </div>
  );
};

export default ShortcutSetting;
