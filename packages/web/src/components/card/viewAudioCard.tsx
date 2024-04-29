import type { MenuProps } from 'antd';
import { Card, Modal } from 'antd';
import { forwardRef, useImperativeHandle, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { BsMusicNoteBeamed } from 'react-icons/bs';

const ViewAudioCard = forwardRef((props: any, ref: any) => {
  useImperativeHandle(ref, () => ({
    handleViewAudio,
  }));

  const { t } = useTranslation();
  const fileRef = useRef(null);
  const directoryRef = useRef(null);

  function handleViewAudio(e: any) {
    window.electronAPI ? window.electronAPI.sendVaOpenWin() : (location.href = '/viewAudio.html');
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
      label: '打开音频',
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
      window.electronAPI.sendVaOpenWin({ audioUrl: file.path });
    } else {
      const url = window.URL.createObjectURL(file);
      Modal.confirm({
        title: '提示',
        content: `是否打开${file.name}`,
        okText: t('modal.ok'),
        cancelText: t('modal.cancel'),
        onOk() {
          window.open(`/viewAudio.html?audioUrl=${encodeURIComponent(url)}`);
        },
      });
    }
    event.target.value = '';
  }

  function handleUploadDirectory(event) {
    const file = event.target.files[0];
    if (window.electronAPI) {
      window.electronAPI.sendVaOpenWin({ audioUrl: file.path });
    }
    event.target.value = '';
  }

  return (
    <div className="cardContent">
      <BsMusicNoteBeamed className="cardIcon" onClick={() => fileRef.current.click()} />
      <div className="cardTitle">{t('home.playAudio')}</div>
      <input
        type="file"
        ref={fileRef}
        accept="audio/*"
        className="fileRef"
        onChange={handleUploadFile}
      />
    </div>
  );
});

export default ViewAudioCard;
