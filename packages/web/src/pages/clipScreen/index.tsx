import { CloseOutlined, MinusOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ininitApp from '../../pages/main';
import styles from './index.module.scss';

const ClipScreen = () => {
  const { t } = useTranslation();
  const [isPlay, setIsPlay] = useState(false);
  const [size, setSize] = useState({ width: 0, height: 0 });
  useEffect(() => {
    window.electronAPI?.handleCsSetIsPlay((e: any, isPlay: boolean) => {
      setIsPlay(isPlay);
    });
    let windowWidth = window.innerWidth;
    let windowHeight = window.innerHeight;
    setSize({ width: windowWidth, height: windowHeight });
  }, []);

  window.addEventListener('resize', () => {
    let windowWidth = window.innerWidth;
    let windowHeight = window.innerHeight;
    setSize({ width: windowWidth, height: windowHeight });
  });

  async function handleCloseWin() {
    window.electronAPI?.sendCsCloseWin();
  }

  async function handleHideWin() {
    window.electronAPI?.sendCsHideWin();
  }

  function handleMinimizeWin() {
    window.electronAPI?.sendCsMinimizeWin();
  }

  return (
    <div id="clipScreen" className={styles.clipScreen}>
      <div className="header">
        {isPlay ? (
          <></>
        ) : (
          <div className="right">
            <Button type="text">{size.width}</Button>x<Button type="text">{size.height}</Button>
            <Button
              type="text"
              icon={<MinusOutlined rev={undefined} />}
              title={t('nav.minimize')}
              onClick={handleMinimizeWin}
            />
            <Button
              type="text"
              icon={<CloseOutlined rev={undefined} />}
              title={t('nav.close')}
              onClick={handleCloseWin}
            />
          </div>
        )}
      </div>
    </div>
  );
};

ininitApp(ClipScreen);
export default ClipScreen;
