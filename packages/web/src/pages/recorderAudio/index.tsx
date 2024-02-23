import { CloseOutlined } from '@ant-design/icons';
import { Button, Card, Modal, Space } from 'antd';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Hover from 'wavesurfer.js/plugins/hover';
import Timeline from 'wavesurfer.js/plugins/timeline';
import AudioRecorder from '../../components/recorderAudio/AudioRecorder';
import WaveSurferPlayer from '../../components/recorderAudio/WaveSurferPlayer';
import { db, defaultUser } from '../../db';
import ininitApp from '../../pages/main';
import styles from './index.module.scss';

const RecordAudio = () => {
  const { t } = useTranslation();
  const [user, setUser] = useState({} as any);
  const [audios, setAudios] = useState([]);

  useEffect(() => {
    user.id || getCurrentUser();
  }, []);

  async function getCurrentUser() {
    try {
      let user = await db.users.where({ userType: 1 }).first();
      if (!user) {
        user = defaultUser;
        await db.users.add(user);
      }
      setUser(user);
    } catch (err) {
      console.log(err);
    }
  }

  function handleSetAudios(audios) {
    setAudios(audios);
  }

  function handleDeleteAudio(index) {
    const _audios = [...audios];
    Modal.confirm({
      title: '提示',
      content: `是否删除当前记录`,
      okText: t('modal.ok'),
      cancelText: t('modal.cancel'),
      onOk() {
        _audios.splice(index, 1);
        setAudios(_audios);
      },
    });
  }
  return (
    <div className={`${styles.recordAudio} ${window.isElectron ? styles.electron : styles.web}`}>
      <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
        <AudioRecorder onSetAudios={handleSetAudios} />
        {audios.map((audio, index) => (
          <Card
            title={`${audio.name}(创建时间:${audio.createdAt}, 时长:${
              audio.duration ? parseInt(String(audio.duration / 1000)) : '--'
            }秒)`}
            key={index}
            extra={
              <Button type="text" onClick={() => handleDeleteAudio(index)}>
                <CloseOutlined />
              </Button>
            }
          >
            <WaveSurferPlayer
              height={100}
              waveColor="rgb(200, 0, 200)"
              progressColor="rgb(100, 0, 100)"
              url={audio.url}
              user={user}
              minPxPerSec={100}
              plugins={[
                Timeline.create(),
                Hover.create({
                  lineColor: '#ff0000',
                  lineWidth: 2,
                  labelBackground: '#555',
                  labelColor: '#fff',
                  labelSize: '11px',
                }),
              ]}
            />
          </Card>
        ))}
      </Space>
    </div>
  );
};

ininitApp(RecordAudio);
export default RecordAudio;
