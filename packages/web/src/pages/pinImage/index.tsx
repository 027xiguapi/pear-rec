import { BorderOutlined, CloseOutlined, MinusOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Dropdown } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useUserApi } from '../../api/user';
import Header from '../../components/common/header';
import ininitApp from '../../pages/main';
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

  useEffect(() => {
    console.log(1, scale);
    const image = document.getElementById('image');
    image.style.transform = 'scale(' + scale + ')';
  }, [scale]);

  useEffect(() => {
    const image = document.getElementById('image');
    image.style.transform = 'rotate(' + rotate + 'deg)';
  }, [rotate]);

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
    let _imgUrl = searchParams.get('imgUrl');
    if (_imgUrl && _imgUrl.substring(0, 4) != 'blob') {
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

  function handleMinimizeWin() {
    window.electronAPI.sendPiMinimizeWin();
  }

  function handleCloseWin() {
    window.electronAPI.sendPiCloseWin();
  }

  function handleUnmaximizeWin() {
    window.electronAPI.sendPiUnmaximizeWin();
  }

  function handleMaximizeWin() {
    window.electronAPI.sendPiMaximizeWin();
  }

  function handleToggleMaximizeWin(isMaximize) {
    isMaximize ? handleUnmaximizeWin() : handleMaximizeWin();
  }

  function handleZoomIn() {
    setScale((scale) => scale * 1.1);
  }

  function handleZoomOut() {
    setScale((scale) => scale * 0.9);
  }

  function handleOneToOne() {
    setScale(1);
  }

  function handleRotateLeft() {
    setRotate((rotate) => rotate - 90);
  }

  return (
    <Dropdown menu={{ items, onClick }} trigger={['contextMenu']}>
      <div className={styles.pinImage}>
        <Header
          className="header"
          type="pin"
          onMinimizeWin={handleMinimizeWin}
          onToggleMaximizeWin={handleToggleMaximizeWin}
          onCloseWin={handleCloseWin}
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          onOneToOne={handleOneToOne}
          onRotateLeft={handleRotateLeft}
        />
        <div
          className="img"
          id="image"
          style={{
            backgroundImage: imgUrl,
          }}
        ></div>
      </div>
    </Dropdown>
  );
};

ininitApp(PinImage);
