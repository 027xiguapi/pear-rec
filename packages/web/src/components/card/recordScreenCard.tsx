import React, { useImperativeHandle, forwardRef } from 'react';
import { useTranslation } from 'react-i18next';
import { CameraOutlined, DownOutlined } from '@ant-design/icons';
import { Card, Space, Dropdown } from 'antd';
import type { MenuProps } from 'antd';

const RecordScreenCard = forwardRef((props: any, ref: any) => {
  useImperativeHandle(ref, () => ({}));
  const { t } = useTranslation();

  function handleClipScreen() {
    window.electronAPI
      ? window.electronAPI.sendCsOpenWin()
      : (location.href = '/recorderScreen.html');
  }

  function handleRecordScreen() {
    window.electronAPI
      ? window.electronAPI.sendRsOpenWin({ isFullScreen: true })
      : (location.href = '/recorderScreen.html');
  }

  const onClick: MenuProps['onClick'] = ({ key }) => {
    if (key == 'full') {
      handleRecordScreen();
    } else {
      handleClipScreen();
    }
  };

  const items: MenuProps['items'] = [
    {
      label: '全屏录制',
      key: 'full',
    },
    {
      label: '局部录制',
      key: 'clip',
    },
  ];

  return (
    <Card hoverable bordered={false} style={{ maxWidth: 300, minWidth: 140, height: 130 }}>
      <div className="cardContent">
        {/* <Dropdown menu={{ items, onClick }}> */}
        <Space>
          <CameraOutlined className="cardIcon" onClick={handleClipScreen} />
          {/* <DownOutlined className="cardToggle" /> */}
        </Space>
        {/* </Dropdown> */}
        <div className="cardTitle">{t('home.screenRecording')}</div>
      </div>
    </Card>
  );
});

export default RecordScreenCard;
