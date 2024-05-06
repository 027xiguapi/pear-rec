import {
  DownloadOutlined,
  EditOutlined,
  FolderOpenOutlined,
  LeftOutlined,
  PrinterOutlined,
  OneToOneOutlined,
  PictureOutlined,
  PushpinOutlined,
  RightOutlined,
  RotateLeftOutlined,
  RotateRightOutlined,
  ScanOutlined,
  SearchOutlined,
  ZoomInOutlined,
  ZoomOutOutlined,
} from '@ant-design/icons';
import { FlipHorizontally, FlipVertically } from '@icon-park/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './index.module.scss';

const logo = './imgs/icons/png/512x512.png';
const Header = (props) => {
  const { t } = useTranslation();
  const [isMaximize, setIsMaximize] = useState(false);
  const [isTop, setIsTop] = useState(false);

  async function handleMinimizeWin() {
    props.onMinimizeWin();
  }

  function handleCloseWin() {
    props.onCloseWin();
  }

  function handleToggleMaximizeWin() {
    props.onToggleMaximizeWin(isMaximize);
    setIsMaximize(!isMaximize);
  }

  function handleAlwaysOnTopWin() {
    let _isTop = !isTop;
    props.onAlwaysOnTopWin(_isTop);
    setIsTop(_isTop);
  }

  return (
    <div className={`${props.className} ${styles.header}`}>
      <div className="center">
        <DownloadOutlined
          className="download icon "
          title={t('nav.download')}
          onClick={() => props.onDownload()}
        />
        <PushpinOutlined
          style={{ color: isTop ? '#08c' : '' }}
          className="alwaysOnTopWin icon"
          title={t('nav.alwaysOnTopWin')}
          onClick={() => handleAlwaysOnTopWin()}
        />
        <FolderOpenOutlined
          className="openFile icon"
          title={t('nav.openFile')}
          onClick={() => props.onOpenFile()}
        />
        <PictureOutlined
          className="uploadFile icon"
          title={t('nav.uploadFile')}
          onClick={() => props.onUploadFile()}
        />
        <ScanOutlined className="scan icon" title={t('nav.scan')} onClick={() => props.onScan()} />
        <SearchOutlined
          className="search icon"
          title={t('nav.search')}
          onClick={() => props.onSearch()}
        />
        <ZoomInOutlined
          className="zoomIn icon"
          title={t('nav.zoomIn')}
          onClick={() => props.onZoomIn()}
        />
        <ZoomOutOutlined
          className="zoomOut icon"
          title={t('nav.zoomOut')}
          onClick={() => props.onZoomOut()}
        />
        <OneToOneOutlined
          className="oneToOne icon"
          title={t('nav.oneToOne')}
          onClick={() => props.onOneToOne()}
        />
        <LeftOutlined className="prev icon" title={t('nav.prev')} onClick={() => props.onPrev()} />
        <RightOutlined className="next icon" title={t('nav.next')} onClick={() => props.onNext()} />
        <RotateLeftOutlined
          className="rotateLeft icon"
          title={t('nav.rotateLeft')}
          onClick={() => props.onRotateLeft()}
        />
        <RotateRightOutlined
          className="rotateRight icon"
          title={t('nav.rotateRight')}
          onClick={() => props.onRotateRight()}
        />
        <FlipHorizontally
          theme="outline"
          size="24"
          strokeWidth={3}
          className="flipHorizontal icon"
          title={t('nav.flipHorizontal')}
          onClick={() => props.onFlipHorizontal()}
        />
        <FlipVertically
          theme="outline"
          size="24"
          strokeWidth={3}
          className="flipVertical icon"
          title={t('nav.flipVertical')}
          onClick={() => props.onFlipVertical()}
        />
        <EditOutlined className="edit icon" title={t('nav.edit')} onClick={() => props.onEdit()} />
        <PrinterOutlined
          className="printer icon"
          title={t('nav.edit')}
          onClick={() => window.print()}
        />
      </div>
    </div>
  );
};

export default Header;
