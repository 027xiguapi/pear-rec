import { DownOutlined, PictureOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Card, Dropdown, Modal, Space } from 'antd';
import { forwardRef, useRef } from 'react';
import { useTranslation } from 'react-i18next';

const ViewImageCard = forwardRef((props: any, ref: any) => {
  const { t } = useTranslation();
  const pinRef = useRef(null);
  const fileRef = useRef(null);
  const imgRef = useRef(null);
  const directoryRef = useRef(null);

  // function handleViewImage(e: any) {
  //   window.electronAPI ? window.electronAPI.sendViOpenWin() : (location.href = '/viewImage.html');
  //   e.stopPropagation();
  // }

  const onClick: MenuProps['onClick'] = ({ key }) => {
    if (key == 'pin') {
      pinRef.current.click();
    } else if (key == 'file') {
      fileRef.current.click();
    } else {
      directoryRef.current.click();
    }
  };

  const items: MenuProps['items'] = [
    {
      label: '钉图',
      key: 'pin',
    },
    {
      label: '打开图片',
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
      window.electronAPI.sendViOpenWin({ imgUrl: file.path });
    } else {
      const imgUrl = window.URL.createObjectURL(file);
      Modal.confirm({
        title: '提示',
        content: `是否打开${file.name}`,
        okText: t('modal.ok'),
        cancelText: t('modal.cancel'),
        onOk() {
          window.open(`/viewImage.html?imgUrl=${encodeURIComponent(imgUrl)}`);
        },
      });
    }
    event.target.value = '';
  }

  function handleUploadImg(event) {
    const file = event.target.files[0];
    if (window.electronAPI) {
      window.electronAPI.sendEiOpenWin({ imgUrl: file.path });
    } else {
      const imgUrl = window.URL.createObjectURL(file);
      Modal.confirm({
        title: '提示',
        content: `是否编辑${file.name}`,
        okText: t('modal.ok'),
        cancelText: t('modal.cancel'),
        onOk() {
          window.open(`/editImage.html?imgUrl=${encodeURIComponent(imgUrl)}`);
        },
      });
    }
    event.target.value = '';
  }

  function handleUploadDirectory(event) {
    const file = event.target.files[0];
    if (window.electronAPI) {
      window.electronAPI.sendViOpenWin({ imgUrl: file.path });
    }
    event.target.value = '';
  }

  function handlePinImg(event) {
    const file = event.target.files[0];
    if (window.electronAPI) {
      window.electronAPI.sendPiOpenWin({ imgUrl: file.path });
    } else {
      const imgUrl = window.URL.createObjectURL(file);
      Modal.confirm({
        title: '提示',
        content: `是否钉图${file.name}`,
        okText: t('modal.ok'),
        cancelText: t('modal.cancel'),
        onOk() {
          window.open(`/pinImage.html?imgUrl=${encodeURIComponent(imgUrl)}`);
        },
      });
    }
    event.target.value = '';
  }

  return (
    <Card hoverable bordered={false} style={{ maxWidth: 300, minWidth: 140, height: 130 }}>
      <span className="extra" onClick={() => imgRef.current.click()}>
        {t('home.edit')}
      </span>
      <div className="cardContent">
        <Dropdown menu={{ items, onClick }}>
          <Space>
            <PictureOutlined className="cardIcon" onClick={() => fileRef.current.click()} />
            <DownOutlined className="cardToggle" />
          </Space>
        </Dropdown>
        <div className="cardTitle">{t('home.viewImage')}</div>
      </div>
      <input
        type="file"
        ref={pinRef}
        accept="image/png,image/jpeg,.webp"
        className="fileRef"
        onChange={handlePinImg}
      />
      <input
        type="file"
        ref={fileRef}
        accept="image/png,image/jpeg,.webp"
        className="fileRef"
        onChange={handleUploadFile}
      />
      <input
        type="file"
        ref={imgRef}
        accept="image/png,image/jpeg,.webp"
        className="fileRef"
        onChange={handleUploadImg}
      />
      <input
        type="file"
        ref={directoryRef}
        directory="directory"
        webkitdirectory="webkitdirectory"
        className="directoryRef"
        onChange={handleUploadDirectory}
      />
    </Card>
  );
});

export default ViewImageCard;
