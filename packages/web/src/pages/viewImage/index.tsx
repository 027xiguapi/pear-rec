import { Modal } from 'antd';
import type { UploadProps } from 'antd/es/upload/interface';
import { saveAs } from 'file-saver';
import QrScanner from 'qr-scanner';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Viewer from 'viewerjs';
import 'viewerjs/dist/viewer.css';
import { useApi } from '../../api';
import { useUserApi } from '../../api/user';
import Header from '../../components/common/header';
import ininitApp from '../../pages/main';
import { urlToBlob } from '../../util/file';
import { searchImg } from '../../util/searchImg';
import { isURL } from '../../util/validate';
import styles from './index.module.scss';

const ViewImage = () => {
  const { t } = useTranslation();
  const api = useApi();
  const userApi = useUserApi();
  const viewerRef = useRef<any>();
  const initialViewIndexRef = useRef<any>(0);
  const inputRef = useRef(null);
  const [user, setUser] = useState<any>({});
  const [imgs, setImgs] = useState([]);
  const [isScaleY, setIsScaleY] = useState(false);
  const [isScaleX, setIsScaleX] = useState(false);

  useEffect(() => {
    window.isOffline || user.id || getCurrentUser();
    handleDrop();
    initImgs();
    return destroyViewer;
  }, []);

  useEffect(() => {
    imgs.length && initViewer();
  }, [imgs]);

  async function getCurrentUser() {
    try {
      const res = (await userApi.getCurrentUser()) as any;
      if (res.code == 0) {
        setUser(res.data);
      }
    } catch (err) {
      console.log(err);
    }
  }

  function destroyViewer() {
    viewerRef.current?.destroy();
  }

  function initViewer() {
    const imgList = document.getElementById('viewImgs') as any;
    const viewer = new Viewer(imgList, {
      backdrop: false,
      button: false,
      className: 'viewer',
      container: '#viewer',
      toolbar: 0,
      viewed: () => {
        initialViewIndexRef.current = viewer.index;
      },
    }) as any;
    viewerRef.current = viewer;
    viewer.view(initialViewIndexRef.current);
  }

  const props: UploadProps = {
    accept: 'image/png,image/jpeg,.webp',
    name: 'file',
    multiple: false,
    showUploadList: false,
    beforeUpload: (file) => {
      const imgUrl = window.URL.createObjectURL(file);
      window.open(`/viewImage.html?imgUrl=${imgUrl}`);
      setImgs([imgUrl]);
      return false;
    },
  };

  // function handleFullScreen() {
  //   const element = document.querySelector('#root');
  //   if (element.requestFullscreen) {
  //     element.requestFullscreen();
  //     setIsFull(true);
  //   }
  // }

  // function handleExitFullscreen() {
  //   if (document.exitFullscreen) {
  //     document.exitFullscreen();
  //     setIsFull(false);
  //   }
  // }

  function handleDrop() {
    document.addEventListener('drop', (e) => {
      e.preventDefault();
      e.stopPropagation();

      let imgs = [];
      let index = 0;
      for (const file of e.dataTransfer.files) {
        imgs.push({ url: window.URL.createObjectURL(file), index });
        index++;
      }
      viewerRef.current?.destroy();
      setImgs(imgs);
    });
    document.addEventListener('dragover', (e) => {
      e.preventDefault();
      e.stopPropagation();
    });
  }

  async function initImgs() {
    const paramsString = location.search;
    const searchParams = new URLSearchParams(paramsString);
    const imgUrl = searchParams.get('imgUrl') || user.historyImg;
    if (imgUrl) {
      if (imgUrl.substring(0, 4) == 'blob') {
        setImgs([{ url: imgUrl, filePath: imgUrl, index: 0 }]);
      } else {
        const res = (await api.getImgs(imgUrl)) as any;
        if (res.code == 0) {
          setImgs(res.data.imgs);
          initialViewIndexRef.current = res.data.currentIndex;
        } else {
          setImgs([{ url: imgUrl, filePath: imgUrl, index: 0 }]);
        }
      }
    }
  }

  function handleImgUpload(event) {
    const selectedFile = event.target.files[0];
    const url = window.URL.createObjectURL(selectedFile);
    viewerRef.current?.destroy();
    setImgs([...imgs, { url: url, index: imgs.length }]);
    initialViewIndexRef.current = imgs.length;
  }

  function handleMinimizeWin() {
    window.electronAPI.sendViMinimizeWin();
  }

  function handleCloseWin() {
    window.electronAPI.sendViCloseWin();
  }

  function handleToggleMaximizeWin(isMaximize) {
    isMaximize ? window.electronAPI.sendViUnmaximizeWin() : window.electronAPI.sendViMaximizeWin();
  }

  function handleAlwaysOnTopWin() {
    const imgUrl = imgs[initialViewIndexRef.current]?.filePath;
    if (window.isElectron) {
      window.electronAPI.sendViCloseWin();
      window.electronAPI.sendPiOpenWin({ imgUrl });
    } else {
      window.open(`/pinImage.html?imgUrl=${imgUrl}`);
    }
  }

  function handleOpenFile() {
    const imgUrl = imgs[initialViewIndexRef.current]?.filePath;
    if (window.isElectron) {
      window.electronAPI.sendViOpenFile(imgUrl);
    }
  }

  function handleUploadFile() {
    inputRef.current.click();
  }

  async function handleScan() {
    try {
      const imgUrl = imgs[initialViewIndexRef.current]?.url;
      const result = await QrScanner.scanImage(imgUrl);
      Modal.confirm({
        title: '扫码结果',
        content: result,
        okText: t('modal.ok'),
        cancelText: t('modal.cancel'),
        onOk() {
          if (isURL(result)) {
            window.electronAPI
              ? window.electronAPI.sendSsOpenExternal(result)
              : window.open(result);
          }
        },
        onCancel() {
          console.log('Cancel');
        },
      });
    } catch (error) {
      console.error('scan Error:', error);
    }
  }

  async function handleSearch() {
    const imgUrl = imgs[initialViewIndexRef.current]?.url;
    const blob = await urlToBlob(imgUrl);
    const tabUrl = await searchImg(blob, user.isProxy);
    if (window.electronAPI) {
      tabUrl && window.electronAPI.sendSsOpenExternal(tabUrl);
      window.electronAPI.sendSsCloseWin();
    } else {
      tabUrl && window.open(tabUrl);
    }
  }

  function handleZoomIn() {
    viewerRef.current.zoom(0.1);
  }

  function handleZoomOut() {
    viewerRef.current.zoom(-0.1);
  }

  function handleOneToOne() {
    viewerRef.current.zoomTo(1);
  }

  function handleReset() {
    viewerRef.current.reset();
  }

  function handlePrev() {
    viewerRef.current.prev();
  }

  function handleNext() {
    viewerRef.current.next();
  }

  function handleRotateLeft() {
    viewerRef.current.rotate(-90);
  }

  function handleRotateRight() {
    viewerRef.current.rotate(90);
  }

  function handleFlipHorizontal() {
    viewerRef.current.scaleX(isScaleX ? 1 : -1);
    setIsScaleX(!isScaleX);
  }

  function handleFlipVertical() {
    viewerRef.current.scaleY(isScaleY ? 1 : -1);
    setIsScaleY(!isScaleY);
  }

  function handleEdit() {
    const imgUrl = imgs[initialViewIndexRef.current]?.filePath;
    if (window.electronAPI) {
      window.electronAPI.sendEiOpenWin({ imgUrl });
    } else {
      viewerRef.current.destroy();
      window.open(`/editImage.html?imgUrl=${imgUrl}`);
    }
  }

  function handleDownload() {
    const imgUrl = imgs[initialViewIndexRef.current]?.filePath;
    if (window.electronAPI) {
      window.electronAPI.sendViDownloadImg(imgUrl);
    } else {
      saveAs(imgUrl, `pear-rec_${+new Date()}.png`);
    }
  }

  return (
    <div className={styles.viewImgs}>
      <Header
        onMinimizeWin={handleMinimizeWin}
        onToggleMaximizeWin={handleToggleMaximizeWin}
        onCloseWin={handleCloseWin}
        onAlwaysOnTopWin={handleAlwaysOnTopWin}
        onOpenFile={handleOpenFile}
        onUploadFile={handleUploadFile}
        onScan={handleScan}
        onSearch={handleSearch}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onOneToOne={handleOneToOne}
        onReset={handleReset}
        onPrev={handlePrev}
        onNext={handleNext}
        onRotateLeft={handleRotateLeft}
        onRotateRight={handleRotateRight}
        onFlipHorizontal={handleFlipHorizontal}
        onFlipVertical={handleFlipVertical}
        onEdit={handleEdit}
        onDownload={handleDownload}
      />
      <div id="viewImgs">
        {imgs.map((img, key) => {
          return <img className="viewImg" src={img.url} key={key} />;
        })}
      </div>
      <div id="viewer"></div>
      <input
        accept="image/png,image/jpeg,.webp"
        type="file"
        className="inputRef"
        ref={inputRef}
        onChange={handleImgUpload}
      />
    </div>
  );
};

ininitApp(ViewImage);
export default ViewImage;
