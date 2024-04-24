import { ExclamationCircleFilled } from '@ant-design/icons';
import { Modal } from 'antd';
import { saveAs } from 'file-saver';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import EditImg from '../../components/editImg';
import { db, defaultUser } from '../../db';
import ininitApp from '../../pages/main';
import styles from './index.module.scss';

const EditImage = () => {
  const { t } = useTranslation();
  const [user, setUser] = useState({} as any);
  const [imgUrl, setImgUrl] = useState<string>('');

  useEffect(() => {
    init();
    user.id || getCurrentUser();
    window.electronAPI?.sendEiFile((file) => {
      addRecord(file);
    });
  }, []);

  async function addRecord(file) {
    try {
      const record = {
        fileName: file.fileName,
        filePath: file.filePath,
        fileData: file.fileData,
        fileType: 'ei',
        userId: user.id,
        createdAt: new Date(),
        createdBy: user.id,
        updatedAt: new Date(),
        updatedBy: user.id,
      };
      const recordId = await db.records.add(record);
      window.electronAPI?.sendNotification({ title: '保存成功', body: '可以在历史中查看' });
    } catch (err) {
      console.log('保存图片err', err);
    }
  }

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
      Modal.confirm({
        title: '数据库错误，是否重置数据库?',
        icon: <ExclamationCircleFilled />,
        content: err.message,
        okText: '确定',
        okType: 'danger',
        cancelText: '取消',
        async onOk() {
          console.log('OK');
          await db.delete();
          location.reload();
        },
        onCancel() {
          console.log('Cancel');
        },
      });
    }
  }

  function init() {
    const paramsString = location.search;
    const searchParams = new URLSearchParams(paramsString);
    let _imgUrl = searchParams.get('imgUrl');
    if (_imgUrl && _imgUrl.substring(0, 7) != 'pearrec' && _imgUrl.substring(0, 4) != 'blob') {
      _imgUrl = `pearrec://${_imgUrl}`;
    }
    setImgUrl(_imgUrl || '');
  }

  function handleSave(blob) {
    if (window.isElectron) {
      window.electronAPI.sendEiDownloadImg(blob);
    } else {
      const fileName = `pear-rec_${+new Date()}.png`;
      saveAs(blob, fileName);
      addRecord({ fileData: blob, fileName: fileName });
    }
  }

  return (
    <div className={styles.container}>
      <EditImg imgUrl={imgUrl} onSave={handleSave} />
    </div>
  );
};

ininitApp(EditImage);
export default EditImage;
