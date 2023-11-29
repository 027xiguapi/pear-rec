import React, { useState, useImperativeHandle, forwardRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Layout, Input, Avatar, Button, Row, Dropdown } from 'antd';
import { SearchOutlined, MoreOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { useApi } from '../../api';
import { eventEmitter } from '../../util/bus';

const logo = './imgs/icons/png/512x512.png';
const { Header } = Layout;

const RecordsHeader = forwardRef((props: any, ref: any) => {
  const { t } = useTranslation();
  const api = useApi();
  const { setting } = props;

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    eventEmitter.emit('searchRecord', e.target.value);
  };

  const items: MenuProps['items'] = [
    {
      key: '1',
      label: '全部清除',
    },
    {
      key: '2',
      label: '打开下载文件夹',
    },
  ];

  const handleMenuClick: MenuProps['onClick'] = async (e) => {
    if (e.key === '1') {
      eventEmitter.emit('deleteAllRecord');
    }
    if (e.key === '2') {
      api.getFolder(setting.filePath);
    }
  };

  function handleLogoClick() {
    if (window.isElectron) {
      window.electronAPI.sendMaOpenWin();
    } else {
      window.open('/');
    }
  }

  return (
    <Header className="recordsHeader">
      <Row className="recordsRow" justify="space-between" align="middle">
        <span className="logo" onClick={handleLogoClick}>
          <Avatar src={logo}>USER</Avatar>
          记录
        </span>
        <Input
          className="search"
          prefix={<SearchOutlined className="site-form-item-icon" />}
          placeholder="搜索记录"
          allowClear
          onChange={handleSearch}
        />
        <Dropdown menu={{ items, onClick: handleMenuClick }}>
          <Button className="more" shape="circle" icon={<MoreOutlined />} />
        </Dropdown>
      </Row>
    </Header>
  );
});

export default RecordsHeader;
