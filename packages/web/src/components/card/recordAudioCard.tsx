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
    <Card
      hoverable
      bordered={false}
      style={{ maxWidth: 300, minWidth: 140, height: 130 }}
      onClick={handleRecordAudio}
    >
      <div className="cardContent">
        {isRecordAudio ? <AudioOutlined rev={undefined} /> : <AudioMutedOutlined rev={undefined} />}
        <div className="cardTitle">{t('home.audioRecording')}</div>
      </div>
    </Card>
  );
});

export default RecordAudioCard;
