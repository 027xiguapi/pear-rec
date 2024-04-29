import { AudioMutedOutlined, AudioOutlined } from '@ant-design/icons';
import { Card } from 'antd';
import { forwardRef, useImperativeHandle, useState } from 'react';
import { useTranslation } from 'react-i18next';

const RecordAudioCard = forwardRef((props: any, ref: any) => {
  useImperativeHandle(ref, () => ({ setIsRecordAudio }));

  const { t } = useTranslation();

  const [isRecordAudio, setIsRecordAudio] = useState(true);

  function handleRecordAudio() {
    window.electronAPI
      ? window.electronAPI.sendRaOpenWin()
      : (location.href = '/recorderAudio.html');
  }

  return (
    <div className="cardContent" onClick={handleRecordAudio}>
      {isRecordAudio ? <AudioOutlined rev={undefined} /> : <AudioMutedOutlined rev={undefined} />}
      <div className="cardTitle">{t('home.audioRecording')}</div>
    </div>
  );
});

export default RecordAudioCard;
