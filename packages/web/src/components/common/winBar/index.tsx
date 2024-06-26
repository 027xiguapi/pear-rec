import {
  BlockOutlined,
  BorderOutlined,
  CloseOutlined,
  DownloadOutlined,
  EditOutlined,
  FolderOpenOutlined,
  LeftOutlined,
  MinusOutlined,
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
import { FlipHorizontally, FlipVertically, Close, Minus, MinusTheTop } from '@icon-park/react';
import { Button } from 'antd';
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
    <div
      className={`${props.className} ${styles.header} ${props.type == 'pin' ? 'no-drag' : 'drag'}`}
    >
      <div className="left" title="pear-rec">
        <img className="logo" src={logo} alt="logo" />
        <span>REC</span>
      </div>
      {props.type == 'pin' ? (
        <div className="center">
          <Button
            className="zoomIn icon"
            type="text"
            icon={<ZoomInOutlined />}
            title={t('nav.zoomIn')}
            onClick={() => props.onZoomIn()}
          />
          <Button
            className="zoomOut icon"
            type="text"
            icon={<ZoomOutOutlined />}
            title={t('nav.zoomOut')}
            onClick={() => props.onZoomOut()}
          />
          <Button
            className="oneToOne icon"
            type="text"
            icon={<OneToOneOutlined />}
            title={t('nav.oneToOne')}
            onClick={() => props.onOneToOne()}
          />
          <Button
            className="rotateRight icon"
            type="text"
            icon={<RotateRightOutlined />}
            title={t('nav.rotateRight')}
            onClick={() => props.onRotateRight()}
          />
        </div>
      ) : (
        <div className="center">
          <Button
            className="download icon  no-drag"
            type="text"
            icon={<DownloadOutlined />}
            title={t('nav.download')}
            onClick={() => props.onDownload()}
          />
          <Button
            className="alwaysOnTopWin icon no-drag"
            type="text"
            icon={<PushpinOutlined style={{ color: isTop ? '#08c' : '' }} />}
            title={t('nav.alwaysOnTopWin')}
            onClick={() => handleAlwaysOnTopWin()}
          />
          <Button
            className="openFile icon no-drag"
            type="text"
            icon={<FolderOpenOutlined />}
            title={t('nav.openFile')}
            onClick={() => props.onOpenFile()}
          />
          <Button
            className="uploadFile icon no-drag"
            type="text"
            icon={<PictureOutlined />}
            title={t('nav.uploadFile')}
            onClick={() => props.onUploadFile()}
          />
          <Button
            className="scan icon no-drag"
            type="text"
            icon={<ScanOutlined />}
            title={t('nav.scan')}
            onClick={() => props.onScan()}
          />
          <Button
            className="search icon no-drag"
            type="text"
            icon={<SearchOutlined />}
            title={t('nav.search')}
            onClick={() => props.onSearch()}
          />
          <Button
            className="zoomIn icon no-drag"
            type="text"
            icon={<ZoomInOutlined />}
            title={t('nav.zoomIn')}
            onClick={() => props.onZoomIn()}
          />
          <Button
            className="zoomOut icon no-drag"
            type="text"
            icon={<ZoomOutOutlined />}
            title={t('nav.zoomOut')}
            onClick={() => props.onZoomOut()}
          />
          <Button
            className="oneToOne icon no-drag"
            type="text"
            icon={<OneToOneOutlined />}
            title={t('nav.oneToOne')}
            onClick={() => props.onOneToOne()}
          />
          <Button
            className="prev icon no-drag"
            type="text"
            icon={<LeftOutlined />}
            title={t('nav.prev')}
            onClick={() => props.onPrev()}
          />
          <Button
            className="next icon no-drag"
            type="text"
            icon={<RightOutlined />}
            title={t('nav.next')}
            onClick={() => props.onNext()}
          />
          <Button
            className="rotateLeft icon no-drag"
            type="text"
            icon={<RotateLeftOutlined />}
            title={t('nav.rotateLeft')}
            onClick={() => props.onRotateLeft()}
          />
          <Button
            className="rotateRight icon no-drag"
            type="text"
            icon={<RotateRightOutlined />}
            title={t('nav.rotateRight')}
            onClick={() => props.onRotateRight()}
          />
          <Button
            className="flipHorizontal icon no-drags"
            type="text"
            icon={<FlipHorizontally theme="outline" size="20" strokeWidth={3} />}
            title={t('nav.flipHorizontal')}
            onClick={() => props.onFlipHorizontal()}
          />
          <Button
            className="flipVertical icon no-drag"
            type="text"
            icon={<FlipVertically theme="outline" size="20" strokeWidth={3} />}
            title={t('nav.flipVertical')}
            onClick={() => props.onFlipVertical()}
          />
          <Button
            className="edit icon no-drag"
            type="text"
            icon={<EditOutlined />}
            title={t('nav.edit')}
            onClick={() => props.onEdit()}
          />
        </div>
      )}

      <div className={`right ${window.isElectron ? '' : 'hide'}`}>
        <Button
          className="minimize icon no-drag"
          type="text"
          icon={<Minus theme="outline" size="20" fill="#333" strokeWidth={3} />}
          title={t('nav.minimize')}
          onClick={handleMinimizeWin}
        />
        <Button
          className="toggleMaximize icon no-drag"
          type="text"
          icon={
            isMaximize ? (
              <MinusTheTop theme="outline" size="20" fill="#333" strokeWidth={3} />
            ) : (
              <BorderOutlined />
            )
          }
          title={isMaximize ? t('nav.unmaximize') : t('nav.maximize')}
          onClick={() => handleToggleMaximizeWin()}
        />
        <Button
          className="close icon no-drag"
          type="text"
          icon={<Close theme="outline" size="20" fill="#333" strokeWidth={3} />}
          title={t('nav.close')}
          onClick={handleCloseWin}
        />
      </div>
    </div>
  );
};

export default Header;
