import {
  CaretRightOutlined,
  FastBackwardOutlined,
  FastForwardOutlined,
  PauseOutlined,
  StepBackwardOutlined,
  StepForwardOutlined,
} from '@ant-design/icons';
import { forwardRef, useContext, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { GifContext } from '../../../components/context/GifContext';
import styles from './play.module.scss';

const Play = forwardRef<any>((props, ref) => {
  const { t } = useTranslation();
  const { gifState, gifDispatch } = useContext(GifContext);
  const [isPlay, setIsPlay] = useState(false);
  const timerRefs = useRef<any>([]);

  useEffect(() => {
    if (isPlay) {
      renderVideoFrame(gifState.index);
    } else {
      timerRefs.current.map((timer) => {
        clearTimeout(timer);
      });
    }
  }, [isPlay]);

  async function renderVideoFrame(index) {
    const length = gifState.videoFrames.length;
    if (index + 1 >= length) {
      setIsPlay(false);
      gifDispatch({ type: 'setIndex', index: 0 });
    } else {
      const videoFrame = gifState.videoFrames[index];
      const duration = videoFrame.duration;
      const timer = setTimeout(() => {
        gifDispatch({ type: 'setIndex', index });
        renderVideoFrame(index + 1);
      }, duration);

      timerRefs.current.push(timer);
    }
  }

  function handlePlayClick() {
    setIsPlay(true);
  }

  function handlePauseClick() {
    setIsPlay(false);
  }

  return (
    <div className={`${styles.play}`} ref={ref}>
      <div className="playList">
        <div className="playBtn" onClick={() => gifDispatch({ type: 'setIndex', index: 0 })}>
          <FastBackwardOutlined className="playIcon" />
          <div className="playBtnTitle">首帧</div>
        </div>
        <div
          className="playBtn"
          onClick={() =>
            gifDispatch({ type: 'setIndex', index: gifState.index < 1 ? 0 : gifState.index - 1 })
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
            gifDispatch({
              type: 'setIndex',
              index:
                gifState.index >= gifState.videoFrames.length - 1
                  ? gifState.videoFrames.length - 1
                  : gifState.index + 1,
            })
          }
        >
          <StepForwardOutlined className="playIcon" />
          <div className="playBtnTitle">下一帧</div>
        </div>
        <div
          className="playBtn"
          onClick={() => gifDispatch({ type: 'setIndex', index: gifState.videoFrames.length - 1 })}
        >
          <FastForwardOutlined className="playIcon" />
          <div className="playBtnTitle">尾帧</div>
        </div>
      </div>
      <div className="subTitle">播放</div>
    </div>
  );
});

export default Play;
