import { BorderOutlined, CloseOutlined, MinusOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Dropdown } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useUserApi } from '../../api/user';
import ininitApp from '../../pages/main';
import styles from './index.module.scss';
const defaultImg = './imgs/th.webp';

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

  useEffect(() => {
    init();
    userRef.current.id || getCurrentUser();
    handleWheel();
  }, []);

  function handleWheel() {
    const image = document.getElementById('image');
    let scale = 1;
    document.addEventListener(
      'wheel',
      (event) => {
        console.log(event, image.style);
        let delta = event.deltaY || event.detail;
        if (delta > 0) {
          scale *= 0.9;
        } else {
          scale *= 1.1;
        }

        image.style.transform = 'scale(' + scale + ')';
        event.preventDefault();
      },
      { passive: false },
    );
  }

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
    const paramsString = location.search;
    const searchParams = new URLSearchParams(paramsString);
    let _imgUrl = searchParams.get('imgUrl') || defaultImg;
    if (_imgUrl.substring(0, 4) != 'blob') {
      _imgUrl = `${window.baseURL}file?url=${_imgUrl}`;
    }

    fetch(_imgUrl)
      .then((response) => response.blob()) // 将获取到的图片转为 Blob
      .then((blob) => {
        setImgUrl(`url(${URL.createObjectURL(blob)})`);
      });
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
      <div
        id="image"
        className={styles.pinImage}
        style={{
          backgroundImage: imgUrl,
        }}
      ></div>
    </Dropdown>
  );
};

ininitApp(PinImage);
