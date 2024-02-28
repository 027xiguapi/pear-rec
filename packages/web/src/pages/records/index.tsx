import { ExclamationCircleFilled } from '@ant-design/icons';
import { Layout, Modal } from 'antd';
import React, { useEffect, useState } from 'react';
import RecordsContent from '../../components/records/RecordsContent';
import RecordsHeader from '../../components/records/RecordsHeader';
import { db, defaultSetting, defaultUser } from '../../db';
import ininitApp from '../../pages/main';
import styles from './index.module.scss';

const Record: React.FC = () => {
  const [user, setUser] = useState<any>({});
  const [setting, setSetting] = useState<any>({});

  useEffect(() => {
    if (user.id) {
      getSetting(user.id);
    } else {
      getCurrentUser();
    }
  }, [user]);

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

  async function getSetting(userId) {
    try {
      let setting = await db.settings.where({ userId }).first();
      if (!setting) {
        setting = { userId, createdBy: userId, updatedBy: userId, ...defaultSetting };
        await db.settings.add(setting);
      }
      setSetting(setting);
    } catch (err) {
      console.log('getSetting', err);
    }
  }

  return (
    <Layout className={styles.records}>
      <RecordsHeader user={user} setting={setting} />
      <RecordsContent />
    </Layout>
  );
};

ininitApp(Record);

export default Record;
