import { PushpinOutlined } from '@ant-design/icons';
import { Card, Modal } from 'antd';
import { forwardRef, useRef } from 'react';
import { useTranslation } from 'react-i18next';

const PinImageCard = forwardRef((props: any, ref: any) => {
  const { t } = useTranslation();
  const fileRef = useRef(null);

  function handlePinImg(event) {
    const file = event.target.files[0];
    const img = new Image();
    const imgUrl = window.URL.createObjectURL(file);
    img.src = imgUrl;
    img.onload = function () {
      const { naturalWidth, naturalHeight } = img;
      const width = naturalWidth > 800 || naturalWidth < 150 ? 800 : naturalWidth;
      const height = naturalHeight > 600 || naturalHeight < 150 ? 600 : naturalHeight;
      if (window.isElectron) {
        window.electronAPI.sendPiOpenWin({
          imgUrl: file.path,
          width: width,
          height: height,
        });
      } else {
        Modal.confirm({
          title: '提示',
          content: `是否贴图${file.name}`,
          okText: t('modal.ok'),
          cancelText: t('modal.cancel'),
          onOk() {
            window.open(`/pinImage.html?imgUrl=${encodeURIComponent(imgUrl)}`);
          },
        });
      }
    };
    event.target.value = '';
  }

  return (
    <div className="cardContent" onClick={() => fileRef.current.click()}>
      <PushpinOutlined className="cardIcon" />
      <div className="cardTitle">{t('home.pinImage')}</div>
      <input
        type="file"
        ref={fileRef}
        accept="image/png,image/jpeg,.webp"
        className="fileRef"
        onChange={handlePinImg}
      />
    </div>
  );
});

export default PinImageCard;
