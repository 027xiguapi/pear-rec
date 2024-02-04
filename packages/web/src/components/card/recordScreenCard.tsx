import { CameraOutlined, DownOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Card, Dropdown, Space } from 'antd';
import { forwardRef, useImperativeHandle } from 'react';
import { useTranslation } from 'react-i18next';

const RecordScreenCard = forwardRef((props: any, ref: any) => {
  useImperativeHandle(ref, () => ({}));
  const { t } = useTranslation();

  const items: MenuProps['items'] = [
    {
      label: '区域录屏',
      key: 'video',
    },
    {
      label: '录动图(GIF)',
      key: 'gif',
    },
    {
      label: '录全屏',
      key: 'full',
    },
  ];

  const onClick: MenuProps['onClick'] = ({ key }) => {
    if (key == 'full') {
      handleFullScreenClick();
    } else {
      handleClipScreenClick(key);
    }
  };

  function handleClipScreenClick(type) {
    if (window.isElectron) {
      window.electronAPI.sendCsOpenWin({ type });
      window.electronAPI.sendMaCloseWin();
    } else {
      location.href = `/recorderScreen.html?type=${type}`;
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
        <Dropdown menu={{ items, onClick }}>
          <Space>
            <CameraOutlined className="cardIcon" onClick={() => handleClipScreenClick('video')} />
            <DownOutlined className="cardToggle" />
          </Space>
        </Dropdown>
        <div className="cardTitle">{t('home.screenRecording')}</div>
      </div>
    </Card>
  );
});

export default RecordScreenCard;
