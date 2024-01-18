import {
  BlockOutlined,
  BorderOutlined,
  CloseOutlined,
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
import { FlipHorizontally, FlipVertically } from '@icon-park/react';
import { Button } from 'antd';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './index.module.scss';

const logo = './imgs/icons/png/512x512.png';
const Header = (props) => {
  const { t } = useTranslation();
  const [isMaximize, setIsMaximize] = useState(false);

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

  return (
    <div className={`${props.className} ${styles.header}`}>
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
            className="rotateLeft icon"
            type="text"
            icon={<RotateLeftOutlined />}
            title={t('nav.rotateLeft')}
            onClick={() => props.onRotateLeft()}
          />
        </div>
      ) : (
        <div className="center">
          <Button
            className="alwaysOnTopWin icon"
            type="text"
            icon={<PushpinOutlined />}
            title={t('nav.alwaysOnTopWin')}
            onClick={() => props.onAlwaysOnTopWin()}
          />
          <Button
            className="openFile icon"
            type="text"
            icon={<FolderOpenOutlined />}
            title={t('nav.openFile')}
            onClick={() => props.onOpenFile()}
          />
          <Button
            className="uploadFile icon"
            type="text"
            icon={<PictureOutlined />}
            title={t('nav.uploadFile')}
            onClick={() => props.onUploadFile()}
          />
          <Button
            className="scan icon"
            type="text"
            icon={<ScanOutlined />}
            title={t('nav.scan')}
            onClick={() => props.onScan()}
          />
          <Button
            className="search icon"
            type="text"
            icon={<SearchOutlined />}
            title={t('nav.search')}
            onClick={() => props.onSearch()}
          />
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
            className="prev icon"
            type="text"
            icon={<LeftOutlined />}
            title={t('nav.prev')}
            onClick={() => props.onPrev()}
          />
          <Button
            className="next icon"
            type="text"
            icon={<RightOutlined />}
            title={t('nav.next')}
            onClick={() => props.onNext()}
          />
          <Button
            className="rotateLeft icon"
            type="text"
            icon={<RotateLeftOutlined />}
            title={t('nav.rotateLeft')}
            onClick={() => props.onRotateLeft()}
          />
          <Button
            className="rotateRight icon"
            type="text"
            icon={<RotateRightOutlined />}
            title={t('nav.rotateRight')}
            onClick={() => props.onRotateRight()}
          />
          <Button
            className="flipHorizontal icon"
            type="text"
            icon={<FlipHorizontally theme="outline" size="20" strokeWidth={3} />}
            title={t('nav.flipHorizontal')}
            onClick={() => props.onFlipHorizontal()}
          />
          <Button
            className="flipVertical icon"
            type="text"
            icon={<FlipVertically theme="outline" size="20" strokeWidth={3} />}
            title={t('nav.flipVertical')}
            onClick={() => props.onFlipVertical()}
          />
          <Button
            className="edit icon"
            type="text"
            icon={<EditOutlined />}
            title={t('nav.edit')}
            onClick={() => props.onEdit()}
          />
        </div>
      )}

      <div className="right">
        <Button
          className="minimize icon"
          type="text"
          icon={<MinusOutlined />}
          title={t('nav.minimize')}
          onClick={handleMinimizeWin}
        />
        <Button
          className="toggleMaximize icon"
          type="text"
          icon={isMaximize ? <BlockOutlined /> : <BorderOutlined />}
          title={isMaximize ? '向下还原' : '最大化'}
          onClick={() => handleToggleMaximizeWin()}
        />
        <Button
          className="close icon"
          type="text"
          icon={<CloseOutlined />}
          title={t('nav.close')}
          onClick={handleCloseWin}
        />
      </div>
    </div>
  );
};

export default Header;
