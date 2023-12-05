import React, { useImperativeHandle, forwardRef } from 'react';
import { useTranslation } from 'react-i18next';
import { CameraOutlined, DownOutlined } from '@ant-design/icons';
import { Card, Space, Button } from 'antd';

const RecordScreenCard = forwardRef((props: any, ref: any) => {
  useImperativeHandle(ref, () => ({}));
  const { t } = useTranslation();

  function handleClipScreen() {
    if (window.isElectron) {
      window.electronAPI.sendCsOpenWin();
      window.electronAPI.sendMaCloseWin();
    } else {
      location.href = '/recorderFullScreen.html';
    }
  }

  function handleFullScreenClick() {
    if (window.isElectron) {
      window.electronAPI.sendRfsOpenWin();
      window.electronAPI.sendMaCloseWin();
    } else {
      location.href = '/recorderFullScreen.html';
    }
  }

  return (
    <Card hoverable bordered={false} style={{ maxWidth: 300, minWidth: 140, height: 130 }}>
      <span className="extra" onClick={handleFullScreenClick}>
        {t('home.fullScreen')}
      </span>
      <div className="cardContent">
        <Space>
          <CameraOutlined className="cardIcon" onClick={handleClipScreen} />
        </Space>
        <div className="cardTitle">{t('home.screenRecording')}</div>
      </div>
    </Card>
  );
});

export default RecordScreenCard;
