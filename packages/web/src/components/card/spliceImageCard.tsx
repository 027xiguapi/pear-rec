import { AlignHorizontally } from '@icon-park/react';
import { Card, Modal } from 'antd';
import { forwardRef, useRef } from 'react';
import { useTranslation } from 'react-i18next';

const SpliceImageCard = forwardRef((props: any, ref: any) => {
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

  function handleSpliceImageClick() {
    if (window.isElectron) {
      window.electronAPI.sendSiOpenWin();
      window.electronAPI.sendMaCloseWin();
    } else {
      location.href = `/spliceImage.html`;
    }
  }

  return (
    <Card hoverable bordered={false} style={{ maxWidth: 300, minWidth: 140, height: 130 }}>
      <div className="cardContent">
        <AlignHorizontally className="cardIcon" onClick={handleSpliceImageClick} />
        <div className="cardTitle">图片拼接</div>
      </div>
    </Card>
  );
});

export default SpliceImageCard;
