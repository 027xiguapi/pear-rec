import { RiImageEditLine } from 'react-icons/ri';
import { forwardRef, useImperativeHandle, useState } from 'react';
import { useTranslation } from 'react-i18next';

const RecordVideoCard = forwardRef((props: any, ref: any) => {
  useImperativeHandle(ref, () => ({ setIsRecordVideo }));

  const { t } = useTranslation();

  const [isRecordVideo, setIsRecordVideo] = useState(true);

  function handleRecorderVideo() {
    window.isElectron
      ? window.electronAPI.sendRvOpenWin()
      : (location.href = '/recorderVideo.html');
  }

  function handleCanvasClick(e) {
    window.isElectron ? window.electronAPI.sendCaOpenWin() : (location.href = '/canvas.html');

    e.preventDefault();
    e.stopPropagation();
  }

  return (
    <div className="cardContent" onClick={handleRecorderVideo}>
      <div className="cardContent">
        <RiImageEditLine />
        <div className="cardTitle">{t('home.videoRecording')}</div>
      </div>
    </div>
  );
});

export default RecordVideoCard;
