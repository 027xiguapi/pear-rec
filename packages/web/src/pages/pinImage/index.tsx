import { BorderOutlined, CloseOutlined, MinusOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Dropdown } from 'antd';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Header from '../../components/common/header';
import { db } from '../../db';
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

let infoImg = { width: 0, height: 0 };
let scale = 1;
let rotate = 0;

const PinImage: React.FC = () => {
  const { t } = useTranslation();
  const [imgUrl, setImgUrl] = useState<any>('');

  useEffect(() => {
    init();
  }, []);

  async function init() {
    const paramsString = location.search;
    const searchParams = new URLSearchParams(paramsString);
    let _imgUrl = searchParams.get('imgUrl');
    let recordId = searchParams.get('recordId');
    if (recordId) {
      let record = await db.records.where({ id: Number(recordId) }).first();
      setImgUrl(`${URL.createObjectURL(record.fileData)}`);
    } else if (_imgUrl.substring(0, 7) != 'pearrec' && _imgUrl.substring(0, 4) != 'blob') {
      _imgUrl = `pearrec://${_imgUrl}`;
      setImgUrl(_imgUrl);
    } else {
      setImgUrl(_imgUrl);
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
    scale = scale * 1.1;
    setSizeWin();
  }

  function handleZoomOut() {
    scale = scale * 0.9;
    setSizeWin();
  }

  function handleOneToOne() {
    scale = 1;
    setSizeWin();
  }

  async function setSizeWin() {
    const isRotate = (rotate / 90) % 2;
    const size = await window.electronAPI?.invokePiGetSizeWin();
    const width = Number(((size.width || 800) * scale).toFixed(0));
    const height = Number(((size.height || 600) * scale).toFixed(0));
    if (isRotate) {
      window.electronAPI?.sendPiSetSizeWin({ width: height, height: width });
    } else {
      window.electronAPI?.sendPiSetSizeWin({ width, height });
    }
  }

  function handleRotateRight() {
    rotate = rotate + 90;
    const image = document.getElementById('image');
    image.style.transform = 'rotate(' + rotate + 'deg)';
    // const isRotate = (rotate / 90) % 2;
    // image.style.width = isRotate ? '100vh' : '100vw';
    // image.style.height = isRotate ? '100vw' : '100vh';
    setSizeWin();
  }

  function handleLoadImg(e) {
    const img = e.target;
    const { naturalWidth, naturalHeight } = img;
    infoImg = { width: naturalWidth, height: naturalHeight };
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
          onRotateRight={handleRotateRight}
        />
        <img className="img" id="image" src={imgUrl} alt="image" onLoad={handleLoadImg} />
      </div>
    </Dropdown>
  );
};

ininitApp(PinImage);
