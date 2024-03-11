import React, { useContext, useRef, useState } from 'react';
import { GifContext } from '../context/GifContext';
import styles from './tool.module.scss';
import FileTool from './tool/File';
import FrameTool from './tool/Frame';
import HistoryTool from './tool/History';
import MoveTool from './tool/Move';
import PlayTool from './tool/Play';
import SettingTool from './tool/Setting';
import SpliceTool from './tool/Splice';

const Tool: React.FC = () => {
  const { gifState, gifDispatch } = useContext(GifContext);
  const toolsRef = useRef({});
  const [nav, setNav] = useState('file');

  function handleSetNav(nav) {
    setNav(nav);
    toolsRef.current[nav]?.scrollIntoView();
  }
  return (
    <div className={styles.tool}>
      <div className="nav">
        <div
          className={nav == 'file' ? 'item current' : 'item'}
          onClick={() => handleSetNav('file')}
        >
          文件
        </div>
        <div
          className={nav == 'frame' ? 'item current' : 'item'}
          onClick={() => handleSetNav('frame')}
        >
          帧
        </div>
        <div
          className={nav == 'history' ? 'item current' : 'item'}
          onClick={() => handleSetNav('history')}
        >
          操作
        </div>
        <div
          className={nav == 'move' ? 'item current' : 'item'}
          onClick={() => handleSetNav('move')}
        >
          移动
        </div>
        <div
          className={nav == 'play' ? 'item current' : 'item'}
          onClick={() => handleSetNav('play')}
        >
          播放
        </div>
        <div
          className={nav == 'setting' ? 'item current' : 'item'}
          onClick={() => handleSetNav('setting')}
        >
          设置
        </div>
        <div
          className={nav == 'splice' ? 'item current' : 'item'}
          onClick={() => handleSetNav('splice')}
        >
          拼接
        </div>
      </div>
      <div className="list">
        <FileTool ref={(el) => (toolsRef.current['file'] = el)} />
        <FrameTool ref={(el) => (toolsRef.current['frame'] = el)} />
        <HistoryTool ref={(el) => (toolsRef.current['history'] = el)} />
        <MoveTool ref={(el) => (toolsRef.current['move'] = el)} />
        <PlayTool ref={(el) => (toolsRef.current['play'] = el)} />
        <SettingTool ref={(el) => (toolsRef.current['setting'] = el)} />
        <SpliceTool ref={(el) => (toolsRef.current['splice'] = el)} />
      </div>
    </div>
  );
};

export default Tool;
