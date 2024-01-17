import {
  BlockOutlined,
  BorderOutlined,
  CloseOutlined,
  MinusOutlined,
  PushpinOutlined,
} from '@ant-design/icons';
import { Button } from 'antd';
import { ipcRenderer } from 'electron';
import { useState } from 'react';
import styles from './index.module.scss';

const WinBar = () => {
  const [isMaximize, setIsMaximize] = useState(false);
  const [isAlwaysOnTop, setIsAlwaysOnTop] = useState(false);

  async function handleCloseWin() {
    ipcRenderer.send('vi:close-win');
  }

  async function handleHideWin() {
    ipcRenderer.send('vi:hide-win');
  }

  function handleMinimizeWin() {
    ipcRenderer.send('vi:minimize-win');
  }

  function handleMaximizeWin() {
    ipcRenderer.send('vi:maximize-win');
    setIsMaximize(true);
  }

  function handleUnmaximizeWin() {
    ipcRenderer.send('vi:unmaximize-win');
    setIsMaximize(false);
  }

  function handleToggleMaximizeWin() {
    isMaximize ? handleUnmaximizeWin() : handleMaximizeWin();
  }

  function handleToggleAlwaysOnTopWin() {
    const _isAlwaysOnTop = !isAlwaysOnTop;
    setIsAlwaysOnTop(_isAlwaysOnTop);
    ipcRenderer.send('vi:set-always-on-top', _isAlwaysOnTop);
  }

  return (
    <div className={styles.winBar}>
      <Button
        type="text"
        icon={<PushpinOutlined rev={undefined} />}
        className={`toolbarIcon ${isAlwaysOnTop ? 'active' : ''}`}
        title="置顶"
        onClick={() => handleToggleAlwaysOnTopWin()}
      />
      <Button
        type="text"
        icon={<MinusOutlined rev={undefined} />}
        className="toolbarIcon"
        title="最小化"
        onClick={() => handleMinimizeWin()}
      />
      <Button
        type="text"
        icon={isMaximize ? <BlockOutlined rev={undefined} /> : <BorderOutlined rev={undefined} />}
        className="toolbarIcon"
        title={isMaximize ? '向下还原' : '最大化'}
        onClick={() => handleToggleMaximizeWin()}
      />
      <Button
        type="text"
        icon={<CloseOutlined rev={undefined} />}
        className="toolbarIcon"
        title="关闭"
        onClick={() => handleHideWin()}
      />
    </div>
  );
};

export default WinBar;
