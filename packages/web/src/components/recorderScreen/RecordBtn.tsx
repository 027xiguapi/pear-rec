import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { BsRecordCircle } from 'react-icons/bs';

const RecordBtn = (props) => {
  const { t } = useTranslation();

  return (
    <div>
      <div className={`recordBtn ${props.isRecording ? 'blink' : ''}`}>
        <BsRecordCircle />
      </div>
      <div>{props.type == 'gif' ? t('recorderScreen.gif') : t('recorderScreen.record')}</div>
    </div>
  );
};

export default RecordBtn;
