import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { CameraOne } from '@icon-park/react';

const Camera = (props) => {
  const { t } = useTranslation();

  function handleCamera() {
    if (window.electronAPI) {
      window.electronAPI?.sendPvOpenWin();
    }
  }

  return (
    <div className={`toolbarIcon camera`} title={t('recorderScreen.camera')} onClick={handleCamera}>
      <CameraOne className="icon" size={28} />
    </div>
  );
};

export default Camera;
