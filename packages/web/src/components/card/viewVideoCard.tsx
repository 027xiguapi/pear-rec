import { Video } from '@icon-park/react';
import type { MenuProps } from 'antd';
import { Card, Modal } from 'antd';
import { forwardRef, useImperativeHandle, useRef } from 'react';
import { useTranslation } from 'react-i18next';

const ViewVideoCard = forwardRef((props: any, ref: any) => {
  useImperativeHandle(ref, () => ({
    handleViewVideo,
  }));

  const { t } = useTranslation();
  const fileRef = useRef(null);
  const directoryRef = useRef(null);

  function handleViewVideo(e: any) {
    window.electronAPI ? window.electronAPI.sendVvOpenWin() : (location.href = '/viewVideo.html');
    e.stopPropagation();
  }

  const onClick: MenuProps['onClick'] = ({ key }) => {
    if (key == 'file') {
      fileRef.current.click();
    } else {
      directoryRef.current.click();
    }
  };

  const items: MenuProps['items'] = [
    {
      label: '打开视频',
      key: 'file',
    },
    {
      label: '打开文件夹',
      key: 'directory',
      disabled: !window.electronAPI,
    },
  ];

  function handleUploadFile(event) {
    const file = event.target.files[0];
    if (window.electronAPI) {
      window.electronAPI.sendVvOpenWin({ videoUrl: file.path });
    } else {
      const url = window.URL.createObjectURL(file);
      Modal.confirm({
        title: '提示',
        content: `是否打开${file.name}`,
        okText: t('modal.ok'),
        cancelText: t('modal.cancel'),
        onOk() {
          window.open(`/viewVideo.html?videoUrl=${encodeURIComponent(url)}`);
        },
      });
    }
    event.target.value = '';
  }

  function handleUploadDirectory(event) {
    const file = event.target.files[0];
    if (window.electronAPI) {
      window.electronAPI.sendVvOpenWin({ videoUrl: file.path });
    }
    event.target.value = '';
  }

  return (
    <Card hoverable bordered={false} style={{ maxWidth: 300, minWidth: 140, height: 130 }}>
      <div className="cardContent">
        {/* <Dropdown menu={{ items, onClick }}>
          <Space>
            <Video
              theme="outline"
              size="32"
              fill="#1677ff"
              className="cardIcon"
              onClick={() => fileRef.current.click()}
            />
            <DownOutlined className="cardToggle" />
          </Space>
        </Dropdown> */}
        <Video
          theme="outline"
          size="32"
          fill="#1677ff"
          className="cardIcon"
          onClick={() => fileRef.current.click()}
        />
        <div className="cardTitle">{t('home.watchVideo')}</div>
      </div>
      <input
        type="file"
        ref={fileRef}
        accept="video/*"
        className="fileRef"
        onChange={handleUploadFile}
      />
      {/* <input
        type="file"
        ref={directoryRef}
        directory="directory"
        webkitdirectory="webkitdirectory"
        className="directoryRef"
        onChange={handleUploadDirectory}
      /> */}
    </Card>
  );
});

export default ViewVideoCard;
