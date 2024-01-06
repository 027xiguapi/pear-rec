import React, { useState, useContext, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  FastBackwardOutlined,
  FastForwardOutlined,
  StepForwardOutlined,
  StepBackwardOutlined,
  CaretRightOutlined,
  PauseOutlined,
} from '@ant-design/icons';
import { GifContext } from '../../../components/context/GifContext';
import styles from './play.module.scss';

const Play = (props) => {
  const { t } = useTranslation();
  const { videoFrames, setVideoFrames, setFrameDuration, indexRef } =
    useContext(GifContext);
  const [isPlay, setIsPlay] = useState(false);
  const timerRef = useRef<any>('');

  useEffect(() => {
    if (isPlay) {
      const length = videoFrames.length;
      let index = indexRef.current;
      let duration = 0;
      for (let i = 0; i < length; i++) {
        let videoFrame = videoFrames[i];
        duration += videoFrame.duration;
        timerRef.current = setTimeout(() => {
          props.setCurrentVideoFrame(index);
          index++;
          if (index >= length - 1) {
            clearTimeout(timerRef.current);
            setIsPlay(false);
            props.setCurrentVideoFrame(0);
          }
        }, duration);
      }
    } else {
      clearInterval(timerRef.current);
    }
  }, [isPlay]);

  function handlePlayClick() {
    setIsPlay(true);
  }

  function handlePauseClick() {
    setIsPlay(false);
  }

  return (
    <div className={`${styles.play}`}>
      <div className="playList">
        <div className="playBtn" onClick={() => props.setCurrentVideoFrame(0)}>
          <FastBackwardOutlined className="playIcon" />
          <div className="playBtnTitle">首帧</div>
        </div>
        <div
          className="playBtn"
          onClick={() =>
            props.setCurrentVideoFrame(indexRef.current < 1 ? 0 : indexRef.current - 1)
          }
        >
          <StepBackwardOutlined className="playIcon" />
          <div className="playBtnTitle">上一帧</div>
        </div>
        {isPlay ? (
          <div className="playBtn" onClick={handlePauseClick}>
            <PauseOutlined className="playIcon pauseIcon" />
            <div className="playBtnTitle">暂停</div>
          </div>
        ) : (
          <div className="playBtn" onClick={handlePlayClick}>
            <CaretRightOutlined className="playIcon" />
            <div className="playBtnTitle">播放</div>
          </div>
        )}
        <div
          className="playBtn"
          onClick={() =>
            props.setCurrentVideoFrame(
              indexRef.current >= videoFrames.length - 1
                ? videoFrames.length - 1
                : indexRef.current + 1,
            )
          }
        >
          <StepForwardOutlined className="playIcon" />
          <div className="playBtnTitle">下一帧</div>
        </div>
        <div className="playBtn" onClick={() => props.setCurrentVideoFrame(videoFrames.length - 1)}>
          <FastForwardOutlined className="playIcon" />
          <div className="playBtnTitle">尾帧</div>
        </div>
      </div>
      <div className="subTitle">播放</div>
    </div>
  );
};

export default Play;
