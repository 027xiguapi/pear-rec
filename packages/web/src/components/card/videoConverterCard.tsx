import { FileConversion } from '@icon-park/react';
import { Card } from 'antd';
import { forwardRef, useRef } from 'react';
import { useTranslation } from 'react-i18next';

const VideoConverterCard = forwardRef((props: any, ref: any) => {
  const { t } = useTranslation();

  function handleOpenWin() {
    if (window.electronAPI) {
      window.electronAPI.sendVcOpenWin();
    } else {
      window.open(`/videoConverter.html`);
    }
  }

  return (
    <Card
      hoverable
      bordered={false}
      style={{ maxWidth: 300, minWidth: 140, height: 130 }}
      onClick={handleOpenWin}
    >
      <div className="cardContent">
        <FileConversion className="cardIcon" />
        <div className="cardTitle">视频转gif</div>
      </div>
    </Card>
  );
});

export default VideoConverterCard;
