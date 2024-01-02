import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import GIF from 'gif.js';
import { Button, Modal, Progress } from 'antd';
import { saveAs } from 'file-saver';
import async from 'async';
import { useApi } from '../../api';

export default function VideoToGifConverter({ videoFrames, user }) {
  const { t } = useTranslation();
  const api = useApi();
  const gifRef = useRef(null);
  const gifBlobRef = useRef(null);
  const canvasRef = useRef(null);
  const [percent, setPercent] = useState(0);
  const videoFramesRef = useRef([]);
  const indexRef = useRef(0);
  const [currentImg, setCurrentImg] = useState<number>(0);
  const delay = 100;
  // const [videoFrames, setVideoFrames] = useState([]);

  // const handleVideoDecodeClick = async () => {
  //   // const dataUri = `
  //   // https://w3c.github.io/webcodecs/samples/data/bbb_video_avc_frag.mp4`;
  //   const dataUri = `http://localhost:9190/video?url=C:\\Users\\Administrator\\Downloads\\davinci.mp4`;
  //   // `http://localhost:9190/video?url=C:\\Users\\Administrator\\Documents\\Pear%20Files\\c106a26a-21bb-5538-8bf2-57095d1976c1\\rs\\rs-1703556579452-320065280.mp4`;
  //   const rendererName = '2d';
  //   const canvas = document.querySelector('canvas').transferControlToOffscreen?.();
  //   const worker = new Worker(new URL('./video-decode-display/worker.js', import.meta.url));
  //   function setStatus(message) {
  //     message.data['imgs'] && setVideoFrames(message.data['imgs']);
  //   }
  //   worker.addEventListener('message', setStatus);
  //   const duration = 100;
  //   worker.postMessage({ dataUri, rendererName, canvas, duration }, [canvas]);
  // };

  useEffect(() => {
    if (videoFramesRef.current.length) {
      const img = videoFramesRef.current[0];
      img.onload = function () {
        renderImgToCanvas(img);
      };
    }
  }, [videoFrames]);

  const handlePlayClick = async () => {
    const length = videoFramesRef.current.length;
    let index = indexRef.current;
    const timer = setInterval(() => {
      setCurrentVideoFrame(index);
      index++;
      if (index >= length) {
        clearInterval(timer);
        setCurrentVideoFrame(0);
      }
    }, delay);
  };

  function renderImgToCanvas(img) {
    const ratio = window.devicePixelRatio || 1;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    let { naturalWidth, naturalHeight } = img;
    canvas.width = naturalWidth * ratio;
    canvas.height = naturalHeight * ratio;
    canvas.style.width = naturalWidth + 'px';
    canvas.style.height = naturalHeight + 'px';
    context.scale(ratio, ratio);
    context.drawImage(img, 0, 0, naturalWidth, naturalHeight);
    img.scrollIntoView();
  }

  async function handleConvertClick() {
    convertToGif();
  }

  function handleCurrentVideoFrameClick(index) {
    setCurrentVideoFrame(index);
  }

  function setCurrentVideoFrame(index) {
    indexRef.current = index;
    setCurrentImg(videoFramesRef.current[index]);
    renderImgToCanvas(videoFramesRef.current[index]);
  }

  const convertToGif = async () => {
    const worker = new URL('./gif.js/gif.worker.js', import.meta.url) as any;

    const gif = new GIF({
      workers: 4,
      quality: 10,
      workerScript: worker,
    });

    gif.on('finished', (blob) => {
      gifBlobRef.current = blob;
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
          delay: delay,
          copy: true,
        });
      }
      return gif.render();
    });
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

  return (
    <div className="gifConverter">
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
      <div className="content">
        <canvas ref={canvasRef}></canvas>
      </div>
      <div className="videoFrames">
        {videoFrames.map((videoFrame, index) => (
          <div
            className={`${'videoFrame ' + (index == indexRef.current ? 'current' : '')}`}
            key={index}
            onClick={(e) => handleCurrentVideoFrameClick(index)}
          >
            <img
              src={videoFrame.url}
              alt={videoFrame.filePath}
              ref={(el) => (videoFramesRef.current[index] = el)}
            />
            <div className="info">{index}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
