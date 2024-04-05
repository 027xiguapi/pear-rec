import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { BsFillStopFill } from 'react-icons/bs';
import { Button } from 'antd';

const StopRecorder = (props) => {
  const { t } = useTranslation();

  function stopRecord() {
    props.stopRecord();
    window.electronAPI?.sendRsStopRecord();
    console.log('停止录制');
  }

  return (
    <div className="playRecorder">
      <Button
        type="text"
        icon={<BsFillStopFill />}
        className="toolbarIcon stopBtn"
        title={t('recorderScreen.save')}
        onClick={stopRecord}
      />
      <div className="toolbarTitle">{t('recorderScreen.save')}</div>
    </div>
  );
};

export default StopRecorder;
