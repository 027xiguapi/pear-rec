import { saveAs } from 'file-saver';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useUserApi } from '../../api/user';
import EditImg from '../../components/editImg';
import ininitApp from '../../pages/main';
import styles from './index.module.scss';

const EditImage = () => {
  const { t } = useTranslation();
  const userApi = useUserApi();
  const userRef = useRef({} as any);
  const [imgUrl, setImgUrl] = useState<string>('');

  useEffect(() => {
    init();
    userRef.current.id || getCurrentUser();
  }, []);

  async function getCurrentUser() {
    try {
      const res = (await userApi.getCurrentUser()) as any;
      if (res.code == 0) {
        userRef.current = res.data;
      }
    } catch (err) {
      console.log(err);
    }
  }

  function init() {
    const paramsString = location.search;
    const searchParams = new URLSearchParams(paramsString);
    let _imgUrl = searchParams.get('imgUrl');
    if (_imgUrl && _imgUrl.substring(0, 4) != 'blob') {
      _imgUrl = `${window.baseURL}file?url=${_imgUrl}`;
    }
    setImgUrl(_imgUrl || '');
  }

  function handleSave(blob) {
    saveAs(blob, `pear-rec_${+new Date()}.png`);
  }

  return (
    <div className={styles.container}>
      <EditImg imgUrl={imgUrl} onSave={handleSave} />
    </div>
  );
};

ininitApp(EditImage);
export default EditImage;
