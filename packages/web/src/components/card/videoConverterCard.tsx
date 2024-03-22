import { FileConversion } from '@icon-park/react';
import { Card, Modal } from 'antd';
import { forwardRef, useRef } from 'react';
import { useTranslation } from 'react-i18next';

const VideoConverterCard = forwardRef((props: any, ref: any) => {
  const { t } = useTranslation();
  const fileRef = useRef(null);

  function handleUploadFile(event) {
    const file = event.target.files[0];
    if (window.electronAPI) {
      window.electronAPI.sendVcOpenWin({ videoUrl: file.path });
    } else {
      const videoUrl = window.URL.createObjectURL(file);
      Modal.confirm({
        title: '提示',
        content: `是否编辑${file.name}`,
        okText: t('modal.ok'),
        cancelText: t('modal.cancel'),
        onOk() {
          window.open(`/videoConverter.html?videoUrl=${encodeURIComponent(videoUrl)}`);
        },
      });
    }
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
        <FileConversion className="cardIcon" />
        <div className="cardTitle">视频转gif</div>
      </div>
      <input
        type="file"
        ref={fileRef}
        accept="video/*"
        className="fileRef"
        onChange={handleUploadFile}
      />
    </Card>
  );
});

export default VideoConverterCard;
