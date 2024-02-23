import APlayer from 'aplayer';
import 'aplayer/dist/APlayer.min.css';
import { useEffect, useRef, useState } from 'react';
import { useApi } from '../../api';
import { db } from '../../db';
import ininitApp from '../../pages/main';
import styles from './index.module.scss';

const ViewAudio = () => {
  const api = useApi();
  let refPlayer = useRef<any>();
  const [audio, setAudio] = useState<any>([]);

  useEffect(() => {
    if (audio.length) {
      const options = {
        container: document.getElementById('aplayer'),
        autoplay: true,
        audio: audio,
      };
      const player = new APlayer(options);
      refPlayer.current = player;
    } else {
      init();
      handleDrop();
    }
  }, [audio]);

  async function init() {
    const paramsString = location.search;
    const searchParams = new URLSearchParams(paramsString);
    const audioUrl = searchParams.get('audioUrl');
    const recordId = searchParams.get('recordId');
    let audio = [];
    if (audioUrl) {
      audio = [{ url: audioUrl, cover: './imgs/music.png' }];
      try {
        const res = (await api.getAudios(audioUrl)) as any;
        if (res.code == 0) {
          audio = res.data;
        }
      } catch (err) {
        console.log(err);
      }
    }
    if (recordId) {
      let record = await db.records.where({ id: Number(recordId) }).first();
      audio = [{ url: URL.createObjectURL(record.fileData), cover: './imgs/music.png' }];
    }
    setAudio(audio);
  }

  function handleDrop() {
    document.addEventListener('drop', (e) => {
      e.preventDefault();
      e.stopPropagation();

      let audios = [];
      for (const file of e.dataTransfer.files) {
        audios.push({
          url: window.URL.createObjectURL(file),
          name: file.name,
          cover: './imgs/music.png',
        });
      }
      refPlayer.current?.destroy();
      setAudio(audios);
    });
    document.addEventListener('dragover', (e) => {
      e.preventDefault();
      e.stopPropagation();
    });
  }

  return (
    <div className={styles.viewAudio}>
      <div id="aplayer"></div>
    </div>
  );
};

ininitApp(ViewAudio);
export default ViewAudio;
