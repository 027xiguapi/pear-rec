import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Progress } from 'antd';

const SaveRecorder = (props) => {
  const { t } = useTranslation();

  return (
    <div className="saveRecorder">
      <Button type="text" loading>
        {t('recorderScreen.saving')}...
      </Button>
      <div className="toolbarTitle">
        {props.percent == 0 || props.percent == 100 ? (
          <Progress percent={props.percent} showInfo={false} />
        ) : (
          ''
        )}
      </div>
    </div>
  );
};

export default SaveRecorder;
