import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { BsPlayFill } from 'react-icons/bs';

const PlayRecorder = (props) => {
  const { t } = useTranslation();

  function startRecord() {
    props.startRecord();
    window.electronAPI?.sendRsStartRecord();
    console.log('开始录像...');
  }

  return (
    <div className="playRecorder">
      <div className="toolbarIcon playBtn" title={t('recorderScreen.play')} onClick={startRecord}>
        <BsPlayFill />
      </div>
      <div className="toolbarTitle">{t('recorderScreen.play')}</div>
    </div>
  );
};

export default PlayRecorder;
