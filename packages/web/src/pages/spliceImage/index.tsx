import { saveAs } from 'file-saver';
import React from 'react';
import { useTranslation } from 'react-i18next';
import SpliceImg from '../../components/spliceImg';
import ininitApp from '../main';
import styles from './index.module.scss';

const SpliceImage: React.FC = () => {
  const { t } = useTranslation();

  const fileList = [];

  function handleSave(blob) {
    saveAs(blob, `pear-rec_${+new Date()}.png`);
  }

  return (
    <div className={styles.spliceImage}>
      <SpliceImg onSave={handleSave} fileList={fileList} isVertical={true} />
    </div>
  );
};

ininitApp(SpliceImage);
