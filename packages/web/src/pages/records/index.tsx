import { Layout } from 'antd';
import React, { useEffect, useState } from 'react';
import RecordsContent from '../../components/records/RecordsContent';
import RecordsHeader from '../../components/records/RecordsHeader';
import { db, defaultUser } from '../../db';
import ininitApp from '../../pages/main';
import { Local } from '../../util/storage';
import styles from './index.module.scss';

const Record: React.FC = () => {
  const [user, setUser] = useState(Local.get('user') || ({} as any));
  const [setting, setSetting] = useState({} as any);

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
    }
  }

  async function getSetting(userId) {
    // const res = (await settingApi.getSetting(userId)) as any;
    // if (res.code == 0) {
    //   setSetting(res.data || {});
    // }
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
