import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { CameraOutlined } from '@ant-design/icons';

const ShotScreen = (props) => {
  const { t } = useTranslation();

  function handleShotScreen() {
    props.isRecording && props.onShotScreen();
  }

  return (
    <div
      className={`${props.isRecording ? '' : 'disabled'} toolbarIcon shotScreenBtn`}
      title={t('recorderScreen.shotScreen')}
      onClick={handleShotScreen}
    >
      <CameraOutlined />
    </div>
  );
};

export default ShotScreen;
