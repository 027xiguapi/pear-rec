import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { AudioMutedOutlined, AudioOutlined } from '@ant-design/icons';

const MuteRecorder = (props) => {
  const { t } = useTranslation();
  const [isMute, setIsMute] = useState(false); // 标记是否静音

  function handleToggleMute() {
    if (!props.isRecording) {
      isMute ? unmuteRecording() : muteRecording();
    }
  }

  // 静音录制
  function muteRecording() {
    setIsMute(true);
    console.log('录像已静音');
  }

  // 取消静音
  function unmuteRecording() {
    setIsMute(false);
    console.log('取消静音');
  }

  return (
    <div
      className={`${props.isRecording ? 'disabled' : ''} ${
        isMute ? '' : 'muted'
      } toolbarIcon toggleMuteBtn`}
      onClick={handleToggleMute}
      title={isMute ? t('recorderScreen.unmute') : t('recorderScreen.mute')}
    >
      {isMute ? <AudioMutedOutlined /> : <AudioOutlined />}
    </div>
  );
};

export default MuteRecorder;
