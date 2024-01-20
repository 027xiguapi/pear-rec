import { BorderOutlined, CloseOutlined, MinusOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Dropdown } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useUserApi } from '../../api/user';
// import Header from '../../components/common/header';
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
  const userApi = useUserApi();
  const userRef = useRef({} as any);
  const [imgUrl, setImgUrl] = useState<any>('');
  const [scale, setScale] = useState<any>(1);
  const [rotate, setRotate] = useState<any>(0);

  useEffect(() => {
    init();
    userRef.current.id || getCurrentUser();
  }, []);

  async function getCurrentUser() {
    try {
      const res = (await userApi.getCurrentUser()) as any;
      if (res.code == 0) {
        userRef.current = res.data;
      }
    } catch (err) {
      console.log(err);
    }
  }

  async function init() {
    const constraints = {
      audio: false,
      video: true
    };
    try {
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      handleSuccess(stream);
    } catch (e) {
      console.log(e)
    }
  }

  function handleSuccess(stream) {
    const video = document.querySelector('video');
    video.srcObject = stream;
  }

  const onClick: MenuProps['onClick'] = ({ key }) => {
    if (key == '1') {
      window.electronAPI.sendPiCloseWin();
    } else if (key == '2') {
      window.electronAPI.sendPiMinimizeWin();
    } else {
      window.electronAPI.sendPiMaximizeWin();
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
