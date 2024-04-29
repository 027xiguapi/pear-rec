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
    <div className="cardContent" onClick={handleOpenWin}>
      <FileConversion className="cardIcon" />
      <div className="cardTitle">视频转gif</div>
    </div>
  );
});

export default VideoConverterCard;
