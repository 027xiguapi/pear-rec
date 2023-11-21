import React, { useEffect, useState } from 'react';
import { Layout } from 'antd';
import RecordsHeader from '../../components/records/RecordsHeader';
import RecordsContent from '../../components/records/RecordsContent';
import ininitApp from '../../pages/main';
import { useUserApi } from '../../api/user';
import { useSettingApi } from '../../api/setting';
import { Local } from '../../util/storage';
import styles from './index.module.scss';

const Record: React.FC = () => {
  const userApi = useUserApi();
  const settingApi = useSettingApi();
  const [user, setUser] = useState(Local.get('user') || ({} as any));
  const [setting, setSetting] = useState({} as any);

  useEffect(() => {
    if (user.id) {
      getSetting(user.id);
    } else {
      window.isOffline || getCurrentUser();
    }
  }, [user]);

  async function getCurrentUser() {
    const res = (await userApi.getCurrentUser()) as any;
    if (res.code == 0) {
      const user = res.data;
      setUser(user);
      Local.set('user', user);
    }
  }

  async function getSetting(userId) {
    const res = (await settingApi.getSetting(userId)) as any;
    if (res.code == 0) {
      setSetting(res.data || {});
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
