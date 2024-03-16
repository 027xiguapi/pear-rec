import { ScanOutlined } from '@ant-design/icons';
import { Card, Modal } from 'antd';
import QrScanner from 'qr-scanner';
import { forwardRef, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { isURL } from '../../util/validate';

const SearchImageCard = forwardRef((props: any, ref: any) => {
  const { t } = useTranslation();
  const fileRef = useRef(null);

  async function handleUploadFile(event) {
    const file = event.target.files[0];
    const imgUrl = window.URL.createObjectURL(file);
    const result = await QrScanner.scanImage(imgUrl);
    Modal.confirm({
      title: '扫码结果',
      content: result,
      okText: t('modal.ok'),
      cancelText: t('modal.cancel'),
      onOk() {
        if (isURL(result)) {
          window.electronAPI ? window.electronAPI.sendSsOpenExternal(result) : window.open(result);
        }
      },
      onCancel() {
        console.log('Cancel');
      },
    });
    event.target.value = '';
  }

  return (
    <Card
      hoverable
      bordered={false}
      style={{ maxWidth: 300, minWidth: 140, height: 130 }}
      onClick={() => fileRef.current.click()}
    >
      <div className="cardContent">
        <ScanOutlined className="cardIcon" />
        <div className="cardTitle">扫码</div>
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

export default SearchImageCard;
