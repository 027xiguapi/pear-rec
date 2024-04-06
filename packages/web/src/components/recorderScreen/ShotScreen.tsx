import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { CameraOutlined } from '@ant-design/icons';

const ShotScreen = (props) => {
  const { t } = useTranslation();

  function handleShotScreen() {
    props.onShotScreen();
    console.log('截图');
  }

  return (
    <div
      className="toolbarIcon shotScreenBtn"
      title={t('recorderScreen.shotScreen')}
      onClick={handleShotScreen}
    >
      <CameraOutlined />
    </div>
  );
};

export default ShotScreen;
