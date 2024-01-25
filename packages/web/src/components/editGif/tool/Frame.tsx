import { FileAdditionOne, FileFailedOne, ToLeft, ToRight } from '@icon-park/react';
import { useContext, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useApi } from '../../../api';
import { GifContext } from '../../context/GifContext';
import { HistoryContext } from '../../context/HistoryContext';
import { UserContext } from '../../context/UserContext';
import styles from './frame.module.scss';

const Frame = (props) => {
  const { t } = useTranslation();
  const api = useApi();
  const inputRef = useRef(null);
  const { user, setUser } = useContext(UserContext);
  const { historyState, historyDispatch } = useContext(HistoryContext);
  const { gifState, gifDispatch } = useContext(GifContext);

  useEffect(() => {}, []);

  function handleDeleteFrame() {
    let index = gifState.index;
    let prevVideoFrames = gifState.videoFrames;
    let videoFrame = '';
    let newVideoFrames = prevVideoFrames.filter((_videoFrame, i) => {
      i == index && (videoFrame = _videoFrame);
      return i !== index;
    });
    historyDispatch({ type: 'increment', data: { curd: 'delete', index, videoFrame } });
    gifDispatch({ type: 'setVideoFrames', videoFrames: newVideoFrames });
    newVideoFrames.length <= index &&
      gifDispatch({ type: 'setIndex', index: newVideoFrames.length - 1 });
  }

  async function uploadFileCache(event) {
    const file = event.target.files[0];
    let formData = new FormData();
    formData.append('type', 'cg');
    formData.append('file', file);
    formData.append('userId', user.id);

    const res = (await api.uploadFileCache(formData)) as any;
    if (res.code == 0) {
      handleInsertFrame(res.data);
      event.target.value = '';
    }
  }

  function handleInsertFrame(filePath) {
    let index = gifState.index;
    let newVideoFrame = {
      url: `${window.baseURL}file?url=${filePath}`,
      filePath: filePath,
      index: index + 1,
      duration: 100,
    };
    let prevVideoFrames = gifState.videoFrames;
    const newVideoFrames = [...prevVideoFrames];
    newVideoFrames.splice(index, 0, newVideoFrame);
    gifDispatch({ type: 'setVideoFrames', videoFrames: newVideoFrames });
    historyDispatch({
      type: 'increment',
      data: { curd: 'insert', index, videoFrame: newVideoFrame },
    });
  }

  function handleDeleteNextFrames() {
    let index = gifState.index;
    let prevVideoFrames = gifState.videoFrames;
    let newVideoFrames = [...prevVideoFrames];
    let videoFrames = newVideoFrames.splice(0, index + 1);
    gifDispatch({ type: 'setVideoFrames', videoFrames: videoFrames });
    historyDispatch({
      type: 'increment',
      data: { curd: 'deleteNextList', index, videoFrames: newVideoFrames },
    });
  }

  function handleDeletePrevFrames() {
    let index = gifState.index;
    let prevVideoFrames = gifState.videoFrames;
    const newVideoFrames = [...prevVideoFrames];
    let videoFrames = newVideoFrames.splice(0, index);
    gifDispatch({ type: 'setVideoFrames', videoFrames: newVideoFrames });
    historyDispatch({ type: 'increment', data: { curd: 'deletePrevList', index, videoFrames } });
  }

  function handleMovePrevFrame() {}

  function handleMoveNextFrame() {}

  return (
    <div className={`${styles.frame}`}>
      <div className="frameList">
        <div className="frameBtn" onClick={handleDeleteFrame}>
          <FileFailedOne className="frameIcon" theme="outline" size="27" fill="#749EC4" />
          <div className="frameBtnTitle">删除帧</div>
        </div>
        <div className="frameBtn" onClick={() => inputRef.current.click()}>
          <FileAdditionOne className="frameIcon" theme="outline" size="27" fill="#749EC4" />
          <div className="frameBtnTitle">插入帧</div>
          <input
            type="file"
            accept="image/png,image/jpeg,.webp"
            className="inputRef hide"
            ref={inputRef}
            onChange={uploadFileCache}
          />
        </div>
        <div className="frameBtn" onClick={handleDeletePrevFrames}>
          <ToLeft className="frameIcon" theme="outline" size="27" fill="#749EC4" />
          <div className="frameBtnTitle">删除之前所有</div>
        </div>
        <div className="frameBtn" onClick={handleDeleteNextFrames}>
          <ToRight className="frameIcon" theme="outline" size="27" fill="#749EC4" />
          <div className="frameBtnTitle">删除之后所有</div>
        </div>
      </div>
      <div className="subTitle">帧</div>
    </div>
  );
};

export default Frame;
