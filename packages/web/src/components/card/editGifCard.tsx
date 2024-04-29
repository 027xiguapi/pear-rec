import { GifOutlined } from '@ant-design/icons';
import { Card, Modal } from 'antd';
import { forwardRef, useRef } from 'react';
import { useTranslation } from 'react-i18next';

const EditGifCard = forwardRef((props: any, ref: any) => {
  const { t } = useTranslation();
  const fileRef = useRef(null);

  function handleUploadFile(event) {
    const file = event.target.files[0];
    if (window.electronAPI) {
      window.electronAPI.sendEgOpenWin({ imgUrl: file.path });
    } else {
      const imgUrl = window.URL.createObjectURL(file);
      Modal.confirm({
        title: '提示',
        content: `是否编辑${file.name}`,
        okText: t('modal.ok'),
        cancelText: t('modal.cancel'),
        onOk() {
          window.open(`/editGif.html?imgUrl=${encodeURIComponent(imgUrl)}`);
        },
      });
    }
    event.target.value = '';
  }

  function handleClipScreenClick(type) {
    if (window.isElectron) {
      // window.electronAPI.sendEgOpenWin();
      window.electronAPI.sendCsOpenWin({ type });
      window.electronAPI.sendMaCloseWin();
    } else {
      // location.href = `/editGif.html`;
      location.href = `/recorderScreen.html?type=${type}`;
    }
  }

  return (
    <div className="cardContent">
      <span className="extra" onClick={() => fileRef.current.click()}>
        {t('home.edit')}
      </span>
      <div className="cardContent">
        <GifOutlined className="cardIcon" onClick={() => handleClipScreenClick('gif')} />
        <div className="cardTitle">{t('home.gif')}</div>
      </div>
      <input
        type="file"
        ref={fileRef}
        accept=".gif"
        className="fileRef"
        onChange={handleUploadFile}
      />
    </div>
  );
});

export default EditGifCard;
