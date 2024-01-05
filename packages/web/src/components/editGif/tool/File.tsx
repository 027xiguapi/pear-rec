import React, { useState, useContext, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import GIF from 'gif.js';
import { saveAs } from 'file-saver';
import async from 'async';
import { useApi } from '../../../api';
import { Button, Modal, Progress, FloatButton } from 'antd';
import { DownloadOutlined, FileGifOutlined, CloseOutlined, SaveOutlined } from '@ant-design/icons';
import { UserContext } from '../../context/UserContext';
import { GifContext } from '../../../components/context/GifContext';
import styles from './file.module.scss';

const File = () => {
  const { t } = useTranslation();
  const api = useApi();
  const fileRef = useRef(null);
  const [percent, setPercent] = useState(0);
  const { user, setUser } = useContext(UserContext);
  const { videoFrames, setVideoFrames, frameDuration, setFrameDuration, setFilePath, setImgUrl } =
    useContext(GifContext);

  async function handleConvert() {
    const worker = new URL('../gif.js/gif.worker.js', import.meta.url) as any;

    const gif = new GIF({
      workers: 4,
      quality: 10,
      workerScript: worker,
    });

    gif.on('finished', (blob) => {
      handleDownloadFile(blob);
    });

    gif.on('progress', (progress) => {
      setPercent(Math.round(progress * 100));
    });

    function loadImage(videoFrame, callback) {
      const img = new Image();
      fetch(videoFrame.url)
        .then((response) => response.blob())
        .then((blob) => {
          const videoFrameUrl = URL.createObjectURL(blob) as any;
          img.src = videoFrameUrl;
        })
        .catch((error) => {
          return callback(new Error('Could load ' + error));
        });

      img.onload = function () {
        return callback(null, img);
      };
      img.onerror = function (error) {
        return callback(new Error('Could load ' + error));
      };

      return img;
    }

    async.map(videoFrames, loadImage, function (error, images) {
      if (error != null) {
        throw error;
      }
      for (let j = 0; j < images.length; j++) {
        let image = images[j];
        gif.addFrame(image, {
          delay: frameDuration,
          copy: true,
        });
      }
      return gif.render();
    });
  }

  async function handleSaveClick() {
    await handleConvert();
  }

  async function handleDownloadFile(blob) {
    try {
      const formData = new FormData();
      formData.append('type', 'eg');
      formData.append('userId', user.id);
      formData.append('file', blob);
      const res = (await api.saveFile(formData)) as any;
      if (res.code == 0) {
        if (window.isElectron) {
          window.electronAPI?.sendEgCloseWin();
          window.electronAPI?.sendViOpenWin({ imgUrl: res.data.filePath });
        } else {
          Modal.confirm({
            title: '图片已保存，是否查看？',
            content: `${res.data.filePath}`,
            okText: t('modal.ok'),
            cancelText: t('modal.cancel'),
            onOk() {
              window.open(`/viewImage.html?imgUrl=${res.data.filePath}`);
              console.log('OK');
            },
            onCancel() {
              console.log('Cancel');
            },
          });
        }
      }
    } catch (err) {
      saveAs(blob, `pear-rec_${+new Date()}.gif`);
    }
  }

  function handleUploadImg(event) {
    const file = event.target.files[0];
    if (window.electronAPI) {
      setImgUrl(file.path);
    } else {
      const imgUrl = window.URL.createObjectURL(file);
      setImgUrl(imgUrl);
    }
    event.target.value = '';
  }

  function handleCloseClick() {
    Modal.confirm({
      title: '项目放弃将无法恢复，是否放弃？',
      okText: t('modal.ok'),
      cancelText: t('modal.cancel'),
      async onOk() {
        console.log('OK');
        const res = (await api.deleteFileCache('cg')) as any;
        if (res.code == 0) {
          setVideoFrames([]);
        }
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  }

  return (
    <div className={`${styles.file}`}>
      <div className="fileList">
        <div className="fileBtn">
          <SaveOutlined className="fileIcon saveIcon" onClick={handleSaveClick} />
          <div className="fileBtnTitle">保存</div>
        </div>
        <div className="fileBtn" onClick={() => fileRef.current.click()}>
          <FileGifOutlined className="fileIcon openIcon" />
          <div className="fileBtnTitle">打开文件</div>
          <input
            type="file"
            ref={fileRef}
            accept=".gif"
            className="fileRef hide"
            onChange={handleUploadImg}
          />
        </div>
        <div className="fileBtn" onClick={handleCloseClick}>
          <CloseOutlined className="fileIcon closeIcon" />
          <div className="fileBtnTitle">放弃项目</div>
        </div>
      </div>
      <div className="subTitle">文件</div>
    </div>
  );
};

export default File;
