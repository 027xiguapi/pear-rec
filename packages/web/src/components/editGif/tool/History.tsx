import { Redo, Refresh, Undo } from '@icon-park/react';
import { useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { GifContext } from '../../context/GifContext';
import { HistoryContext } from '../../context/HistoryContext';
import styles from './history.module.scss';

const History = (props) => {
  const { t } = useTranslation();
  const { historyState, historyDispatch } = useContext(HistoryContext);
  const { gifState, gifDispatch } = useContext(GifContext);

  useEffect(() => {
    let { type, history } = historyState.doHistory;
    switch (history && history.curd) {
      case 'delete': {
        type == 'next' ? handleDeleteFrame(history) : handleInsertFrame(history);
        return;
      }
      case 'insert': {
        type == 'next' ? handleInsertFrame(history) : handleDeleteFrame(history);
        return;
      }
      case 'deleteNextList': {
        type == 'next' ? handleDeleteNextFrames(history) : handleInsertNextFrames(history);
        return;
      }
      case 'deletePrevList': {
        type == 'next' ? handleDeletePrevFrames(history) : handleInsertPrevFrames(history);
        return;
      }
      default:
        return;
    }
  }, [historyState.doHistory]);

  function handleInsertFrame(history) {
    const newVideoFrames = [...gifState.videoFrames];
    newVideoFrames.splice(history.index, 0, history.videoFrame);
    gifDispatch({ type: 'setVideoFrames', videoFrames: newVideoFrames });
  }

  function handleDeleteFrame(history) {
    let index = history.index;
    let prevVideoFrames = gifState.videoFrames;
    let videoFrame = '';
    let newVideoFrames = prevVideoFrames.filter((_videoFrame, i) => {
      i == index && (videoFrame = _videoFrame);
      return i !== index;
    });
    gifDispatch({ type: 'setVideoFrames', videoFrames: newVideoFrames });
    newVideoFrames.length <= index &&
      gifDispatch({ type: 'setIndex', index: newVideoFrames.length - 1 });
  }

  function handleInsertNextFrames(history) {
    const newVideoFrames = [...gifState.videoFrames, ...history.videoFrames];
    gifDispatch({ type: 'setVideoFrames', videoFrames: newVideoFrames });
  }

  function handleInsertPrevFrames(history) {
    const newVideoFrames = [...history.videoFrames, ...gifState.videoFrames];
    gifDispatch({ type: 'setVideoFrames', videoFrames: newVideoFrames });
  }

  function handleDeleteNextFrames(history) {
    const newVideoFrames = [...gifState.videoFrames];
    let videoFrames = newVideoFrames.splice(0, history.index + 1);
    gifDispatch({ type: 'setVideoFrames', videoFrames: videoFrames });
  }

  function handleDeletePrevFrames(history) {
    const newVideoFrames = [...gifState.videoFrames];
    newVideoFrames.splice(0, history.index);
    gifDispatch({ type: 'setVideoFrames', videoFrames: newVideoFrames });
  }

  function handleUndoClick() {
    historyState.historyList[historyState.index - 1] && historyDispatch({ type: 'prev' });
  }

  function handleRedoClick() {
    historyState.historyList[historyState.index] && historyDispatch({ type: 'next' });
  }

  function handleResetClick() {
    historyDispatch({ type: 'reset' });
    location.reload();
  }

  return (
    <div className={`${styles.history}`}>
      <div className="historyList">
        <div
          className={`${
            historyState.historyList[historyState.index - 1] ? 'historyBtn' : 'historyBtn disabled'
          }`}
          onClick={handleUndoClick}
        >
          <Undo
            className="historyIcon"
            theme="outline"
            size="27"
            fill={historyState.historyList[historyState.index - 1] ? '#43CCF8' : '#ccc'}
          />
          <div className="historyBtnTitle">撤销</div>
        </div>
        <div
          className={`${
            historyState.historyList[historyState.index] ? 'historyBtn' : 'historyBtn disabled'
          }`}
          onClick={handleRedoClick}
        >
          <Redo
            className="historyIcon"
            theme="outline"
            size="27"
            fill={historyState.historyList[historyState.index] ? '#43CCF8' : '#ccc'}
          />
          <div className="historyBtnTitle">重做</div>
        </div>

        <div className="historyBtn" onClick={handleResetClick}>
          <Refresh className="historyIcon" theme="outline" size="27" fill="#43CCF8" />
          <div className="historyBtnTitle">重置</div>
        </div>
      </div>
      <div className="subTitle">操作</div>
    </div>
  );
};

export default History;
