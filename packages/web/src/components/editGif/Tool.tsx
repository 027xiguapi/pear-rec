import type { TabsProps } from 'antd';
import { Tabs } from 'antd';
import React from 'react';
import FileTool from './tool/File';
import FrameTool from './tool/Frame';
import HistoryTool from './tool/History';
import MoveTool from './tool/Move';
import PlayTool from './tool/Play';
import SettingTool from './tool/Setting';
import SpliceTool from './tool/Splice';

const onChange = (key: string) => {
  console.log(key);
};

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

const Tool: React.FC = () => <Tabs defaultActiveKey="file" items={items} onChange={onChange} />;

export default Tool;
