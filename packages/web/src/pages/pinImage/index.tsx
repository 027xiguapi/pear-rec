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
import Header from '../../components/common/header';
import { db, defaultUser } from '../../db';
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
  const [user, setUser] = useState<any>({});
  const [imgUrl, setImgUrl] = useState<any>('');
  const [scale, setScale] = useState<any>(1);
  const [rotate, setRotate] = useState<any>(0);

  useEffect(() => {
    init();
    user.id || getCurrentUser();
  }, []);

  useEffect(() => {
    const image = document.getElementById('image');
    image.style.transform = 'scale(' + scale + ')';
  }, [scale]);

  useEffect(() => {
    const image = document.getElementById('image');
    image.style.transform = 'rotate(' + rotate + 'deg)';
  }, [rotate]);

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
    const paramsString = location.search;
    const searchParams = new URLSearchParams(paramsString);
    let _imgUrl = searchParams.get('imgUrl');
    let recordId = searchParams.get('recordId');
    if (_imgUrl && _imgUrl.substring(0, 4) != 'blob') {
      _imgUrl = `${window.baseURL}file?url=${_imgUrl}`;
    }
    if (recordId) {
      let record = await db.records.where({ id: Number(recordId) }).first();
      setImgUrl(`url(${URL.createObjectURL(record.fileData)})`);
    } else {
      const data = await fetch(_imgUrl);
      const blob = await data.blob();
      setImgUrl(`url(${URL.createObjectURL(blob)})`);
    }
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
