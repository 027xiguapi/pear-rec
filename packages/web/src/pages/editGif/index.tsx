import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ininitApp from '../../pages/main';
import { useUserApi } from '../../api/user';
import { Local } from '../../util/storage';
import VideoToGifConverter from '../../components/editGif/VideoToGifConverter';
import styles from './index.module.scss';

const EditGif = () => {
  const userApi = useUserApi();
  const { t } = useTranslation();
  const [user, setUser] = useState(Local.get('user') || ({} as any));
  const [recordedUrl, setRecordedUrl] = useState('');

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
    let _videoUrl = searchParams.get('videoUrl');
    if (_videoUrl && _videoUrl.substring(0, 4) != 'blob') {
      _videoUrl = `${window.baseURL}file?url=${_videoUrl}`;
    }
    fetch(_videoUrl)
      .then((response) => response.blob())
      .then((blob) => {
        const _recordedUrl = URL.createObjectURL(blob);
        setRecordedUrl(_recordedUrl);
      })
      .catch((error) => {
        console.error('Failed to download and play video:', error);
      });
  }

  return (
    <div className={`${styles.videoToGif} ${window.isElectron ? styles.electron : styles.web}`}>
      <VideoToGifConverter videoSrc={recordedUrl} user={user} />
    </div>
  );
};

ininitApp(EditGif);

export default EditGif;
