import { ExclamationCircleFilled } from '@ant-design/icons';
import { Modal, Space, Card } from 'antd';
import { saveAs } from 'file-saver';
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import VideoToGif from '../../components/videoToGif';
import ininitApp from '../main';
import { db, defaultUser } from '../../db';
import styles from './index.module.scss';

const App: React.FC = () => {
  const { t } = useTranslation();
  const [user, setUser] = useState({} as any);
  const [videoUrl, setVideoUrl] = useState('');

  useEffect(() => {
    init();
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
    let _videoUrl = searchParams.get('videoUrl');
    if (
      _videoUrl &&
      _videoUrl.substring(0, 7) != 'pearrec' &&
      _videoUrl.substring(0, 4) != 'blob'
    ) {
      _videoUrl = `pearrec://${_videoUrl}`;
    }
    setVideoUrl(_videoUrl || '');
  }

  function handleSave(blob) {
    saveAs(blob, `pear-rec_${+new Date()}.png`);
  }

  return (
    <div className={styles.videoConverter}>
      <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
        <Card title="转换">
          <VideoToGif videoUrl={videoUrl} onSave={handleSave} />
        </Card>
      </Space>
    </div>
  );
};

ininitApp(App);
