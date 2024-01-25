import { Close, FileGif, Save, VideoFile } from '@icon-park/react';
import { Modal, Progress } from 'antd';
import async from 'async';
import { saveAs } from 'file-saver';
import GIF from 'gif.js';
import { useContext, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useApi } from '../../../api';
import { GifContext } from '../../../components/context/GifContext';
import { UserContext } from '../../context/UserContext';
import styles from './file.module.scss';

const File = () => {
  const { t } = useTranslation();
  const api = useApi();
  const fileRef = useRef(null);
  const videoRef = useRef(null);
  const [percent, setPercent] = useState(0);
  const { user, setUser } = useContext(UserContext);
  const { gifState, gifDispatch } = useContext(GifContext);

  async function handleConvert() {
    const worker = new URL('../gif.js/gif.worker.js', import.meta.url) as any;

    const gif = new GIF({
      workers: 4,
      quality: 10,
      workerScript: worker,
    });

    gif.on('finished', (blob) => {
      setPercent(0);
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

    async.map(gifState.videoFrames, loadImage, function (error, images) {
      if (error != null) {
        throw error;
      }
      for (let j = 0; j < images.length; j++) {
        let image = images[j];
        gif.addFrame(image, {
          delay: gifState.videoFrames[j].duration,
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
      gifDispatch({ type: 'setImgUrl', imgUrl: file.path });
    } else {
      const imgUrl = window.URL.createObjectURL(file);
      gifDispatch({ type: 'setImgUrl', imgUrl: imgUrl });
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
          gifDispatch({ type: 'setVideoFrames', videoFrames: [] });
        }
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  }

  function handleUploadVideo(event) {
    const file = event.target.files[0];
    if (window.electronAPI) {
      gifDispatch({ type: 'setVideoUrl', videoUrl: file.path });
    } else {
      const videoUrl = window.URL.createObjectURL(file);
      gifDispatch({ type: 'setVideoUrl', videoUrl: videoUrl });
    }
    event.target.value = '';
  }

  return (
    <div className={`${styles.file}`}>
      <div className="fileList">
        <div className="fileBtn" onClick={() => fileRef.current.click()}>
          <FileGif theme="outline" size="27" fill="#749EC4" />
          <div className="fileBtnTitle">打开动图</div>
          <input
            type="file"
            ref={fileRef}
            accept=".gif"
            className="fileRef hide"
            onChange={handleUploadImg}
          />
        </div>
        <div className="fileBtn" onClick={() => videoRef.current.click()}>
          <VideoFile
            className="fileIcon openIcon"
            theme="outline"
            size="27"
            fill="rgb(177 143 193)"
          />
          <div className="fileBtnTitle">打开视频</div>
          <input
            type="file"
            ref={videoRef}
            accept=".mp4"
            className="videoRef hide"
            onChange={handleUploadVideo}
          />
        </div>
        <div className="fileBtn" onClick={handleSaveClick}>
          <Save className="fileIcon saveIcon" theme="outline" size="27" fill="rgb(235 191 124)" />
          <div className="fileBtnTitle">保存GIF</div>
          {percent ? <Progress size="small" percent={percent} showInfo={false} /> : ''}
        </div>
        <div className="fileBtn" onClick={handleCloseClick}>
          <Close className="fileIcon closeIcon" theme="outline" size="27" fill="#666" />
          <div className="fileBtnTitle">放弃项目</div>
        </div>
      </div>
      <div className="subTitle">文件</div>
    </div>
  );
};

export default File;
