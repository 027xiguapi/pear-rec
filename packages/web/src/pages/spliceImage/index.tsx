import { saveAs } from 'file-saver';
import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useUserApi } from '../../api/user';
import SpliceImg from '../../components/spliceImg';
import ininitApp from '../main';
import styles from './index.module.scss';

const SpliceImage: React.FC = () => {
  const { t } = useTranslation();
  const userApi = useUserApi();
  const userRef = useRef({} as any);
  const [imgUrl, setImgUrl] = useState<any>('');
  const [scale, setScale] = useState<any>(1);
  const [rotate, setRotate] = useState<any>(0);

  // useEffect(() => {
  //   userRef.current.id || getCurrentUser();
  // }, []);

  function handleSave(blob) {
    saveAs(blob, `pear-rec_${+new Date()}.png`);
  }

  return (
    <div className={styles.spliceImage}>
      <SpliceImg onSave={handleSave} />
    </div>
  );
};

ininitApp(SpliceImage);
