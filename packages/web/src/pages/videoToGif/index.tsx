import { saveAs } from 'file-saver';
import React from 'react';
import { useTranslation } from 'react-i18next';
import VideoToGif from '../../components/videoToGif';
import ininitApp from '../main';
import styles from './index.module.scss';

const App: React.FC = () => {
  const { t } = useTranslation();

  const fileList = [];

  function handleSave(blob) {
    saveAs(blob, `pear-rec_${+new Date()}.png`);
  }

  return (
    <div className={styles.videoToGif}>
      <VideoToGif />
    </div>
  );
};

ininitApp(App);
