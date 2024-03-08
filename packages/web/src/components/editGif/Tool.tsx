import type { TabsProps } from 'antd';
import { Tabs } from 'antd';
import React, { useContext } from 'react';
import { GifContext } from '../context/GifContext';
import FileTool from './tool/File';
import FrameTool from './tool/Frame';
import HistoryTool from './tool/History';
import MoveTool from './tool/Move';
import PlayTool from './tool/Play';
import SettingTool from './tool/Setting';
import SpliceTool from './tool/Splice';

const items: TabsProps['items'] = [
  {
    key: 'file',
    label: '文件',
    children: <FileTool />,
  },
  {
    key: 'frame',
    label: '帧',
    children: <FrameTool />,
  },
  {
    key: 'history',
    label: '操作',
    children: <HistoryTool />,
  },
  {
    key: 'move',
    label: '移动',
    children: <MoveTool />,
  },
  {
    key: 'play',
    label: '播放',
    children: <PlayTool />,
  },
  {
    key: 'setting',
    label: '设置',
    children: <SettingTool />,
  },
  {
    key: 'splice',
    label: '拼接',
    children: <SpliceTool />,
  },
];

const Tool: React.FC = () => {
  const { gifState, gifDispatch } = useContext(GifContext);
  return <Tabs defaultActiveKey="file" items={items} />;
};

export default Tool;
