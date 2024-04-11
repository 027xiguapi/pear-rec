import {
  BorderOutlined,
  CloseOutlined,
  ExclamationCircleFilled,
  MinusOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Dropdown, Modal } from 'antd';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { db, defaultUser } from '../../db';
import ininitApp from '../main';
import styles from './index.module.scss';

const items: MenuProps['items'] = [
  {
    label: '关闭',
    key: '1',
    icon: <CloseOutlined />,
  },
  {
    label: '最小化',
    key: '2',
    icon: <MinusOutlined />,
  },
  {
    label: '最大化',
    key: '3',
    icon: <BorderOutlined />,
  },
];

const PinImage: React.FC = () => {
  const { t } = useTranslation();
  const [user, setUser] = useState<any>({});

  useEffect(() => {
    init();
    user.id || getCurrentUser();
  }, []);

  async function getCurrentUser() {
    try {
      let user = await db.users.where({ userType: 1 }).first();
      if (!user) {
        user = defaultUser;
        await db.users.add(user);
      }
      setUser(user);
    } catch (err) {
      console.log(err);
      Modal.confirm({
        title: '数据库错误，是否重置数据库?',
        icon: <ExclamationCircleFilled />,
        content: err.message,
        okText: '确定',
        okType: 'danger',
        cancelText: '取消',
        async onOk() {
          console.log('OK');
          await db.delete();
          location.reload();
        },
        onCancel() {
          console.log('Cancel');
        },
      });
    }
  }

  async function init() {
    const constraints = {
      audio: false,
      video: true,
    };
    try {
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      handleSuccess(stream);
    } catch (e) {
      console.log(e);
      window.electronAPI.sendPvCloseWin();
    }
  }

  function handleSuccess(stream) {
    const video = document.querySelector('video');
    video.srcObject = stream;
  }

  const onClick: MenuProps['onClick'] = ({ key }) => {
    if (key == '1') {
      window.electronAPI.sendPvCloseWin();
    } else if (key == '2') {
      window.electronAPI.sendPvMinimizeWin();
    } else {
      window.electronAPI.sendPvMaximizeWin();
    }
  };

  return (
    <Dropdown menu={{ items, onClick }} trigger={['contextMenu']}>
      <div className={styles.pinVideo}>
        <video id="gum-local" autoPlay playsInline></video>
      </div>
    </Dropdown>
  );
};

ininitApp(PinImage);
