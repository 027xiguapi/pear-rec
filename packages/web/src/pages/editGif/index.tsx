import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ininitApp from '../../pages/main';
import { useUserApi } from '../../api/user';
import { useApi } from '../../api/index';
import { Local } from '../../util/storage';
import GifConverter from '../../components/editGif/GifConverter';
import styles from './index.module.scss';

const EditGif = () => {
  const userApi = useUserApi();
  const api = useApi();
  const { t } = useTranslation();
  const [user, setUser] = useState(Local.get('user') || ({} as any));
  const [recordedUrl, setRecordedUrl] = useState('');
  const [videoFrames, setVideoFrames] = useState([]);

  useEffect(() => {
    window.isOffline || getCurrentUser();
    init();
  }, []);

  async function getCurrentUser() {
    const res = (await userApi.getCurrentUser()) as any;
    if (res.code == 0) {
      const user = res.data;
      setUser(user);
      Local.set('user', user);
    }
  }

  async function init() {
    const paramsString = location.search;
    const searchParams = new URLSearchParams(paramsString);
    let videoUrl = searchParams.get('videoUrl');
    let filePath = searchParams.get('filePath');

    videoUrl ? loadVideo(videoUrl) : loadVideoFrames(filePath);
  }

  function loadVideo(videoUrl) {
    if (videoUrl && videoUrl.substring(0, 4) != 'blob') {
      videoUrl = `${window.baseURL}file?url=${videoUrl}`;
    }
    fetch(videoUrl)
      .then((response) => response.blob())
      .then((blob) => {
        const _recordedUrl = URL.createObjectURL(blob);
        setRecordedUrl(_recordedUrl);
      })
      .catch((error) => {
        console.error('Failed to download and play video:', error);
      });
  }

  async function loadVideoFrames(filePath) {
    const res = (await api.getVideoFrames(filePath)) as any;
    if (res.code == 0) {
      setVideoFrames(res.data);
    }
  }

  return (
    <div className={`${styles.editGif} ${window.isElectron ? styles.electron : styles.web}`}>
      <GifConverter videoFrames={videoFrames} user={user} />
    </div>
  );
};

ininitApp(EditGif);

export default EditGif;
