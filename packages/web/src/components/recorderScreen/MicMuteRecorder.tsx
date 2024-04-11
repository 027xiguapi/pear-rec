import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { AudioMutedOutlined, AudioOutlined } from '@ant-design/icons';

const MuteRecorder = (props) => {
  const { t } = useTranslation();

  function handleToggleMute() {
    if (!props.isRecording) {
      props.onSetIsMicMute();
    }
  }

  return (
    <div
      className={`${props.isRecording ? 'disabled' : ''} ${
        props.isMicMute ? '' : 'muted'
      } toolbarIcon toggleMuteBtn`}
      onClick={handleToggleMute}
      title={props.isMicMute ? t('recorderScreen.unmute') : t('recorderScreen.mute')}
    >
      {props.isMicMute ? <AudioMutedOutlined /> : <AudioOutlined />}
    </div>
  );
};

export default MuteRecorder;
