import { DoubleLeft, DoubleRight, LeftSmall, RightSmall } from '@icon-park/react';
import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { GifContext } from '../../context/GifContext';
import { HistoryContext } from '../../context/HistoryContext';
import { UserContext } from '../../context/UserContext';
import styles from './move.module.scss';

const Move = (props) => {
  const { t } = useTranslation();
  const { user, setUser } = useContext(UserContext);
  const { historyState, historyDispatch } = useContext(HistoryContext);
  const { gifState, gifDispatch } = useContext(GifContext);

  function handleMovePrevFrame() {
    let index = gifState.index;
    let prevVideoFrames = gifState.videoFrames;
    const newVideoFrames = [...prevVideoFrames];
    newVideoFrames.splice(index - 1, 0, newVideoFrames[index]);
    newVideoFrames.splice(index + 1, 1);
    gifDispatch({ type: 'setVideoFrames', videoFrames: newVideoFrames });
    gifDispatch({ type: 'setIndex', index: index - 1 });
    historyDispatch({ type: 'increment', data: { curd: 'movePrev', index } });
  }

  function handleMoveNextFrame() {
    let index = gifState.index;
    const newVideoFrames = [...gifState.videoFrames];
    newVideoFrames.splice(index + 2, 0, newVideoFrames[index]);
    newVideoFrames.splice(index, 1);
    gifDispatch({ type: 'setVideoFrames', videoFrames: newVideoFrames });
    gifDispatch({ type: 'setIndex', index: index + 1 });
    historyDispatch({ type: 'increment', data: { curd: 'moveNext', index } });
  }

  function handleMoveFirstFrame() {
    let index = gifState.index;
    let prevVideoFrames = gifState.videoFrames;
    const newVideoFrames = [...prevVideoFrames];
    const videoFrame = newVideoFrames.splice(index, 1)[0];
    newVideoFrames.splice(0, 0, videoFrame);
    gifDispatch({ type: 'setVideoFrames', videoFrames: newVideoFrames });
    gifDispatch({ type: 'setIndex', index: 0 });
    historyDispatch({ type: 'increment', data: { curd: 'moveFirst', index } });
  }

  function handleMoveLastFrame() {
    let index = gifState.index;
    let prevVideoFrames = gifState.videoFrames;
    const newVideoFrames = [...prevVideoFrames];
    const videoFrame = newVideoFrames.splice(index, 1)[0];
    newVideoFrames.push(videoFrame);
    gifDispatch({ type: 'setVideoFrames', videoFrames: newVideoFrames });
    gifDispatch({ type: 'setIndex', index: prevVideoFrames.length - 1 });
    historyDispatch({ type: 'increment', data: { curd: 'moveLast', index } });
  }

  return (
    <div className={`${styles.move}`}>
      <div className="moveList">
        <div className="moveBtn" onClick={handleMovePrevFrame}>
          <LeftSmall className="moveIcon" theme="outline" size="27" fill="#749EC4" />
          <div className="moveBtnTitle">左移</div>
        </div>
        <div className="moveBtn" onClick={handleMoveNextFrame}>
          <RightSmall className="moveIcon" theme="outline" size="27" fill="#749EC4" />
          <div className="moveBtnTitle">右移</div>
        </div>
        <div className="moveBtn" onClick={handleMoveFirstFrame}>
          <DoubleLeft className="moveIcon" theme="outline" size="27" fill="#749EC4" />
          <div className="moveBtnTitle">移到首位</div>
        </div>
        <div className="moveBtn" onClick={handleMoveLastFrame}>
          <DoubleRight className="moveIcon" theme="outline" size="27" fill="#749EC4" />
          <div className="moveBtnTitle">移到末尾</div>
        </div>
      </div>
      <div className="subTitle">移动</div>
    </div>
  );
};

export default Move;
