import { GithubFilled, HistoryOutlined, SettingOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import UpdateElectron from '../update';

const HomeFooter = () => {
  const { t } = useTranslation();

  function handleOpenRecordWin() {
    window.electronAPI ? window.electronAPI.sendReOpenWin() : window.open('/records.html');
  }

  function handleOpenSettingWin() {
    window.electronAPI ? window.electronAPI.sendSeOpenWin() : window.open('/setting.html');
  }

  function handleOpenGithub() {
    window.open('https://github.com/027xiguapi/pear-rec');
  }

  return (
    <div className="homeFooter">
      <SettingOutlined className="icon" title={t('nav.setting')} onClick={handleOpenSettingWin} />
      <HistoryOutlined className="icon" title={t('nav.record')} onClick={handleOpenRecordWin} />
      <UpdateElectron />
      <GithubFilled className="icon" title={t('nav.github')} onClick={handleOpenGithub} />
    </div>
  );
};

export default HomeFooter;
