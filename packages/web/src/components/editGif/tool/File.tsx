import { Close, FileGif, Save, VideoFile } from '@icon-park/react';
import { Modal, Progress } from 'antd';
import map from 'async/map';
import { saveAs } from 'file-saver';
import GIF from 'gif.js';
import { forwardRef, useContext, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { GifContext } from '../../../components/context/GifContext';
import { db } from '../../../db';
import { UserContext } from '../../context/UserContext';
import VideoToGif from '../../videoToGif';
import styles from './file.module.scss';

const File = forwardRef<any>((props, ref) => {
  const { t } = useTranslation();
  const fileRef = useRef(null);
  const videoRef = useRef(null);
  const [percent, setPercent] = useState(0);
  const [videoUrl, setVideoUrl] = useState('');
  const [isOpenModal, setIsOpenModal] = useState(false);
  const { user, setUser } = useContext(UserContext);
  const { gifState, gifDispatch } = useContext(GifContext);

  useEffect(() => {
    if (gifState.videoUrl) {
      setVideoUrl(gifState.videoUrl);
      setIsOpenModal(true);
    }
  }, [gifState.videoUrl]);

  async function handleConvert() {
    const worker = new URL('/gif.js/gif.worker.js', import.meta.url) as any;

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
      setPercent(Math.ceil(progress * 100));
    });

    function loadImage(videoFrame, callback) {
      const img = new Image();
      img.crossOrigin = '';
      img.onload = function () {
        return callback(null, img);
      };
      img.onerror = function (error) {
        return callback(new Error('Could load ' + error));
      };
      img.src = URL.createObjectURL(videoFrame.fileData);
    }

    map(gifState.videoFrames, loadImage, function (error, images) {
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
    if (percent == 0 || percent == 100) {
      await handleConvert();
    }
  }

  async function handleDownloadFile(blob) {
    try {
      const record = {
        fileName: `pear-rec_${+new Date()}.gif`,
        fileData: blob,
        fileType: 'eg',
        userId: user.id,
        createdAt: new Date(),
        createdBy: user.id,
        updatedAt: new Date(),
        updatedBy: user.id,
      };
      const recordId = await db.records.add(record);
      if (recordId) {
        if (window.isElectron) {
          window.electronAPI?.sendEgCloseWin();
          window.electronAPI?.sendViOpenWin({ recordId: recordId });
        } else {
          Modal.confirm({
            title: '图片已保存，是否查看？',
            content: `${record.fileName}`,
            okText: t('modal.ok'),
            cancelText: t('modal.cancel'),
            onOk() {
              window.open(`/viewImage.html?recordId=${recordId}`);
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
        await db.caches.where('fileType').equals('cg').delete();
        gifDispatch({ type: 'setVideoFrames', videoFrames: [] });
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  }

  function handleUploadVideo(event) {
    const file = event.target.files[0];
    const videoUrl = window.URL.createObjectURL(file);
    setVideoUrl(videoUrl);
    setIsOpenModal(true);
    event.target.value = '';
  }

  function handleSave(img) {
    gifDispatch({ type: 'setImgUrl', imgUrl: img.src });
    setIsOpenModal(false);
  }

  return (
    <div className={`${styles.file}`} ref={ref}>
      <div className="fileGroup">
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
      <Modal
        title="从视频导入帧"
        width={'90%'}
        style={{ top: 10 }}
        open={isOpenModal}
        destroyOnClose
        onCancel={() => setIsOpenModal(false)}
        footer={[]}
      >
        <VideoToGif
          videoUrl={videoUrl}
          onCancel={() => setIsOpenModal(false)}
          onSave={handleSave}
        />
      </Modal>
    </div>
  );
});

export default File;
