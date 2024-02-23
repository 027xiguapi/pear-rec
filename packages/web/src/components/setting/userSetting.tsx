import { Button, Modal } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSettingApi } from '../../api/setting';
import { Local } from '../../util/storage';

const logo = './imgs/icons/png/512x512.png';
const settingApi = useSettingApi();

const UserSetting = (props) => {
  const { t, i18n } = useTranslation();
  const { user, setting } = props;
  const [uuid, setUuid] = useState('');
  const [createdTime, setCreatedTime] = useState('');

  useEffect(() => {
    user.id && setUser();
  }, [user]);

  async function setUser() {
    setUuid(user.uuid);
    setCreatedTime(user.createdAt);
  }

  function formatTime(time: any) {
    return dayjs(time).format('YYYY-MM-DD hh:mm:ss');
  }

  function handleResetClick() {
    Modal.confirm({
      title: '提示',
      content: `是否重置设置？`,
      okText: t('modal.ok'),
      cancelText: t('modal.cancel'),
      onOk() {
        Local.set('i18n', 'zh');
        i18n.changeLanguage('zh');
        setting.id && settingApi.resetSetting(setting.id);
        window.electronAPI?.sendSeSetLanguage('zh');
      },
    });
  }

  return (
    <div className="userSetting">
      <div className="logo">
        <img alt="logo" src={logo} />
      </div>
      <div className="info">
        <p>版本：1.3.12</p>
        <p>{uuid}</p>
        <p>{formatTime(createdTime)}</p>
        <Button type="primary" className="resetBtn" danger onClick={handleResetClick}>
          {t('setting.reset')}
        </Button>
      </div>
    </div>
  );
};

export default UserSetting;
