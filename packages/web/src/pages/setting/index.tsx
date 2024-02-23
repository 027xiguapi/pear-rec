import { Tabs } from 'antd';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import BasicSetting from '../../components/setting/basicSetting';
import ServerSetting from '../../components/setting/serverSetting';
import ShortcutSetting from '../../components/setting/shortcutSetting';
import UserSetting from '../../components/setting/userSetting';
import { db, defaultSetting, defaultUser } from '../../db';
import ininitApp from '../../pages/main';
import { Local } from '../../util/storage';
import styles from './index.module.scss';

const Setting = () => {
  const { t } = useTranslation();
  const [setting, setSetting] = useState({} as any);
  const [user, setUser] = useState(Local.get('user') || ({} as any));

  useEffect(() => {
    if (user.id) {
      getSetting(user.id);
    } else {
      getCurrentUser();
    }
  }, [user]);

  const items = [
    {
      key: 'userSetting',
      label: t('setting.userSetting'),
      children: UserSetting,
    },
    {
      key: 'basicSetting',
      label: t('setting.basicSetting'),
      children: BasicSetting,
      forceRender: true,
    },
    {
      key: 'serverSetting',
      label: t('setting.serverSetting'),
      children: ServerSetting,
      forceRender: true,
    },
    {
      key: 'shortcutSetting',
      label: t('setting.shortcutSetting'),
      children: ShortcutSetting,
      forceRender: true,
    },
  ];

  async function getCurrentUser() {
    try {
      let user = await db.users.where({ userType: 1 }).first();
      if (!user) {
        user = defaultUser;
        await db.users.add(user);
      }
      setUser(user);
      Local.set('user', user);
    } catch (err) {
      console.log('getCurrentUser', err);
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
    <div className={`${styles.setting} ${window.isElectron ? styles.electron : styles.web}`}>
      <Tabs
        tabPosition="left"
        items={items.map((tab, i) => {
          return {
            label: tab.label,
            key: tab.key,
            children: <tab.children user={user} setting={setting} />,
            forceRender: tab.forceRender,
          };
        })}
      />
    </div>
  );
};

ininitApp(Setting);

export default Setting;
