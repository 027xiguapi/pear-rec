import { Video } from '@icon-park/react';
import type { MenuProps } from 'antd';
import { Modal } from 'antd';
import { forwardRef, useImperativeHandle, useRef } from 'react';
import { useTranslation } from 'react-i18next';

const ViewVideoCard = forwardRef((props: any, ref: any) => {
  useImperativeHandle(ref, () => ({
    handleViewVideo,
  }));

  const { t } = useTranslation();
  const fileRef = useRef(null);
  const videoRef = useRef(null);
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

  function handleUploadVideo(event) {
    const file = event.target.files[0];
    if (window.electronAPI) {
      window.electronAPI.sendEvOpenWin({ videoUrl: file.path });
    } else {
      const url = window.URL.createObjectURL(file);
      Modal.confirm({
        title: '提示',
        content: `是否打开${file.name}`,
        okText: t('modal.ok'),
        cancelText: t('modal.cancel'),
        onOk() {
          window.open(`/editVideo.html?videoUrl=${encodeURIComponent(url)}`);
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
    <div className="cardContent">
      <span className="extra" onClick={() => videoRef.current.click()}>
        {t('home.edit')}
      </span>
      <Video
        theme="outline"
        size="32"
        fill="#1677ff"
        className="cardIcon"
        onClick={() => fileRef.current.click()}
      />
      <div className="cardTitle">{t('home.watchVideo')}</div>
      <input
        type="file"
        ref={fileRef}
        accept="video/*"
        className="fileRef"
        onChange={handleUploadFile}
      />
      <input
        type="file"
        ref={videoRef}
        accept="video/*"
        className="fileRef"
        onChange={handleUploadVideo}
      />
    </div>
  );
});

export default ViewVideoCard;
