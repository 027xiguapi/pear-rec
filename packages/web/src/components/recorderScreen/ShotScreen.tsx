import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { CameraOutlined } from '@ant-design/icons';
import { Button } from 'antd';

const ShotScreen = (props) => {
  const { t } = useTranslation();

  function handleShotScreen() {
    props.shotScreen();
    console.log('截图');
  }

  return (
    <div className="playRecorder">
      <Button
        type="text"
        icon={<CameraOutlined />}
        className="toolbarIcon shotScreenBtn"
        title={t('recorderScreen.shotScreen')}
        onClick={handleShotScreen}
      ></Button>
      <div className="toolbarTitle">{t('recorderScreen.shotScreen')}</div>
    </div>
  );
};

export default ShotScreen;
