import React, { useImperativeHandle, forwardRef, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { EditOutlined } from '@ant-design/icons';
import { Space, Card, Dropdown, Modal } from 'antd';

const EditImageCard = forwardRef((props: any, ref: any) => {
  const { t } = useTranslation();
  const fileRef = useRef(null);

  function handleUploadFile(event) {
    const file = event.target.files[0];
    if (window.electronAPI) {
      window.electronAPI.sendEiOpenWin({ imgUrl: 'pearrec:///' + file.path });
    } else {
      const imgUrl = window.URL.createObjectURL(file);
      Modal.confirm({
        title: '提示',
        content: `是否打开${file.name}`,
        okText: t('modal.ok'),
        cancelText: t('modal.cancel'),
        onOk() {
          window.open(`/editImage.html?imgUrl=${encodeURIComponent(imgUrl)}`);
        },
      });
    }
    event.target.value = '';
  }

  return (
    <Card hoverable bordered={false} style={{ maxWidth: 300, minWidth: 140, height: 130 }}>
      <div className="cardContent">
        <EditOutlined className="cardIcon" onClick={() => fileRef.current.click()} />
        <div className="cardTitle">{t('home.editImg')}</div>
      </div>
      <input
        type="file"
        ref={fileRef}
        accept="image/png,image/jpeg,.webp"
        className="fileRef"
        onChange={handleUploadFile}
      />
    </Card>
  );
});

export default EditImageCard;
