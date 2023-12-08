import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { MenuProps } from 'antd';
import ininitApp from '../../pages/main';
import { Dropdown, theme } from 'antd';
import { MinusOutlined, BorderOutlined, CloseOutlined } from '@ant-design/icons';
import { useApi } from '../../api';
import { useUserApi } from '../../api/user';
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
    const paramsString = location.search;
    const searchParams = new URLSearchParams(paramsString);
    let _imgUrl = searchParams.get('imgUrl') || defaultImg;
    if (_imgUrl.substring(0, 4) != 'blob') {
      _imgUrl = `${window.baseURL}getFile?url=${_imgUrl}`;
    }

    fetch(_imgUrl)
      .then((response) => response.blob()) // 将获取到的图片转为 Blob
      .then((blob) => {
        console.log(blob);
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
        className={styles.pinImage}
        style={{
          backgroundImage: imgUrl,
        }}
      ></div>
    </Dropdown>
  );
};

ininitApp(PinImage);
export default PinImage;
