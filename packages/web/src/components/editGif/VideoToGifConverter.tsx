import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import GIF from 'gif.js';
import { Button, Modal, Progress } from 'antd';
import { saveAs } from 'file-saver';
import { useApi } from '../../api';

export default function VideoToGifConverter({ videoSrc, user }) {
  const { t } = useTranslation();
  const api = useApi();
  const gifRef = useRef(null);
  const gifBlobRef = useRef(null);
  const videoRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [percent, setPercent] = useState(0);

  const handleConvertClick = async () => {
    await videoRef.current.play();
    convertToGif();
  };

  const handlePlayClick = async () => {
    await videoRef.current.play();
  };

  useEffect(() => {
    const handleLoadedMetadata = () => {
      setIsLoaded(true);
    };

    videoRef.current.addEventListener('loadedmetadata', handleLoadedMetadata);

    return () => {
      videoRef.current.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };
  }, []);

  const convertToGif = async () => {
    if (!isLoaded) {
      return;
    }

    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const context = canvas.getContext('2d', { willReadFrequently: true });
    const worker = new URL('./gif.js/gif.worker.js', import.meta.url) as any;
    // const delay = 1000 / videoRef.current.playbackRate;
    const delay = 100;

    const gif = new GIF({
      workers: 4,
      quality: 10,
      workerScript: worker,
    });

    gif.on('finished', (blob) => {
      gifBlobRef.current = blob;
      const gifUrl = URL.createObjectURL(blob);
      gifRef.current.src = gifUrl;
    });

    gif.on('progress', (progress) => {
      setPercent(Math.round(progress * 100));
    });

    gif.addFrame(canvas, { copy: true, delay: delay });

    const renderFrame = () => {
      context.drawImage(videoRef.current, 0, 0);
      gif.addFrame(canvas, { copy: true, delay: delay });
      if (videoRef.current.currentTime < videoRef.current.duration) {
        setTimeout(renderFrame, delay);
      } else {
        gif.render();
      }
    };
    setTimeout(renderFrame, delay);
  };

  async function handleSaveClick() {
    const blob = gifBlobRef.current;
    if (blob == null) {
      Modal.error({ title: '提示', content: '先保存再下载' });
      return false;
    }
    try {
      const formData = new FormData();
      formData.append('type', 'eg');
      formData.append('userId', user.id);
      formData.append('file', blob);
      const res = (await api.saveFile(formData)) as any;
      if (res.code == 0) {
        if (window.isElectron) {
          window.electronAPI?.sendEiCloseWin();
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

  return (
    <div>
      <div className="tool">
        <Button className="playBtn" onClick={handlePlayClick} type="primary" danger>
          播放
        </Button>
        <Button className="convertBtn" onClick={handleConvertClick} type="primary">
          保存
        </Button>
        <Button className="saveBtn" disabled={percent != 100} onClick={handleSaveClick}>
          下载
        </Button>
        <Progress percent={percent} />
      </div>
      <video className="videoRef" ref={videoRef} src={videoSrc}></video>

      <img ref={gifRef} className="hide" alt="GIF" />
    </div>
  );
}
