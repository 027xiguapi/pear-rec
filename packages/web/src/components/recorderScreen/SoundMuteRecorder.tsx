import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { MutedOutlined, SoundOutlined } from '@ant-design/icons';

const SoundMuteRecorder = (props) => {
  const { t } = useTranslation();

  function handleToggleMute() {
    if (!props.isRecording) {
      props.onSetIsSoundMute();
    }
  }

  return (
    <div
      className={`${props.isRecording ? 'disabled' : ''} ${
        props.isSoundMute ? '' : 'muted'
      } toolbarIcon toggleMuteBtn`}
      onClick={handleToggleMute}
      title={props.isSoundMute ? t('recorderScreen.unmute') : t('recorderScreen.mute')}
    >
      {props.isSoundMute ? <MutedOutlined /> : <SoundOutlined />}
    </div>
  );
};

export default SoundMuteRecorder;
