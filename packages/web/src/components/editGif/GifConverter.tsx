import { ZoomInOutlined, ZoomOutOutlined } from '@ant-design/icons';
import { FloatButton, Progress } from 'antd';
import { useContext, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { GifContext } from '../context/GifContext';
import { UserContext } from '../context/UserContext';
import Tool from './Tool';

export default function VideoToGifConverter() {
  const { t } = useTranslation();
  const canvasRef = useRef(null);
  const videoFramesRef = useRef([]);
  const [scale, setScale] = useState<number>(100);
  const { user, setUser } = useContext(UserContext);
  const { gifState, gifDispatch } = useContext(GifContext);

  useEffect(() => {
    let index = gifState.index;
    setCurrentVideoFrame(index);
  }, [gifState.index]);

  function renderImgToCanvas(index) {
    const imgs = document.querySelectorAll('.videoFrame img');
    const _img = imgs[index] as any;
    const img = new Image();
    img.src = _img.src;
    const ratio = window.devicePixelRatio || 1;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    img.onload = function () {
      const { naturalWidth, naturalHeight } = img;
      canvas.width = naturalWidth * ratio;
      canvas.height = naturalHeight * ratio;
      canvas.style.width = naturalWidth + 'px';
      canvas.style.height = naturalHeight + 'px';
      context.scale(ratio, ratio);
      context.clearRect(0, 0, naturalWidth, naturalHeight);
      context.drawImage(img, 0, 0, naturalWidth, naturalHeight);
    };
    _img.scrollIntoView();
  }

  function clearCanvas() {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    const { width, height } = canvas;
    context.clearRect(0, 0, width, height);
  }

  function handleCurrentVideoFrameClick(index) {
    gifDispatch({ type: 'setIndex', index });
  }

  function setCurrentVideoFrame(index) {
    let videoFrames = document.querySelectorAll('.videoFrame');
    videoFrames[index] && renderImgToCanvas(index);
  }

  return (
    <div className="gifConverter">
      <Tool />
      <div className="content">
        <canvas ref={canvasRef} style={{ transform: 'scale(' + scale / 100 + ')' }}></canvas>
        <div className="info">
          <div>
            {gifState.index + 1} / {gifState.videoFrames?.length || 0}{' '}
          </div>
          <div>{scale}%</div>
        </div>
        <FloatButton.Group shape="square" style={{ right: 24, bottom: 150 }}>
          <FloatButton
            icon={<ZoomInOutlined />}
            onClick={() => {
              setScale((scale) => scale + 2);
            }}
          />
          <FloatButton
            icon={<ZoomOutOutlined />}
            onClick={() => {
              setScale((scale) => scale - 2);
            }}
          />
        </FloatButton.Group>
      </div>
      <div className="videoFrames">
        {gifState.videoFrames.length ? (
          gifState.videoFrames.map((videoFrame, index) => (
            <div
              className={`${'videoFrame ' + (index == gifState.index ? 'current' : '')}`}
              key={index}
              onClick={(e) => handleCurrentVideoFrameClick(index)}
            >
              <img
                src={URL.createObjectURL(videoFrame.fileData)}
                alt={videoFrame.fileName}
                ref={(el) => (videoFramesRef.current[index] = el)}
              />
              <div className="info">
                <div className="index">{index + 1}</div>
                <div className="duration">{videoFrame.duration}ms</div>
              </div>
            </div>
          ))
        ) : (
          <Progress size="small" percent={gifState.load} />
        )}
      </div>
    </div>
  );
}
