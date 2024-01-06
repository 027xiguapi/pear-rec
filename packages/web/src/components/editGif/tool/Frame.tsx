import React, { useState, useContext, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useApi } from '../../../api';
import { FileAdditionOne, FileFailedOne, ToLeft, ToRight } from '@icon-park/react';
import { GifContext } from '../../context/GifContext';
import { UserContext } from '../../context/UserContext';
import { HistoryContext } from '../../context/HistoryContext';
import styles from './frame.module.scss';

const Frame = (props) => {
  const { t } = useTranslation();
  const api = useApi();
  const inputRef = useRef(null);
  const { user, setUser } = useContext(UserContext);
  const { historyState, historyReducer } = useContext(HistoryContext);
  const { videoFrames, setVideoFrames, indexRef } = useContext(GifContext);

  useEffect(() => {}, []);

  function handleDeleteFrame() {
    let index = indexRef.current;
    setVideoFrames((prevVideoFrames) => {
      let videoFrame = '';
      let newVideoFrames = prevVideoFrames.filter((_videoFrame, i) => {
        i == index && (videoFrame = _videoFrame);
        return i !== index;
      });
      newVideoFrames.length <= indexRef.current && (indexRef.current = newVideoFrames.length - 1);
      historyReducer({ type: 'increment', data: { curd: 'delete', index, videoFrame } });
      return newVideoFrames;
    });
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
    let index = indexRef.current;
    let newVideoFrame = {
      url: `${window.baseURL}file?url=${filePath}`,
      filePath: filePath,
      index: index + 1,
      duration: 100,
    };
    setVideoFrames((prevVideoFrames) => {
      const newVideoFrames = [...prevVideoFrames];
      newVideoFrames.splice(index, 0, newVideoFrame);
      historyReducer({
        type: 'increment',
        data: { curd: 'insert', index, videoFrame: newVideoFrame },
      });
      return newVideoFrames;
    });
  }

  function handleDeleteNextFrame() {
    let index = indexRef.current;
    let videoFrames = null;
    let newVideoFrames = null;
    setVideoFrames((prevVideoFrames) => {
      newVideoFrames = [...prevVideoFrames];
      videoFrames = newVideoFrames.splice(0, index + 1);
      return videoFrames;
    });
    historyReducer({
      type: 'increment',
      data: { curd: 'deleteList', index, videoFrames: newVideoFrames },
    });
  }

  function handleDeletePrevFrame() {
    let index = indexRef.current;
    let videoFrames = null;
    setVideoFrames((prevVideoFrames) => {
      const newVideoFrames = [...prevVideoFrames];
      videoFrames = newVideoFrames.splice(0, index);
      return newVideoFrames;
    });
    historyReducer({ type: 'increment', data: { curd: 'deleteList', index, videoFrames } });
  }

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
        <div className="frameBtn" onClick={handleDeletePrevFrame}>
          <ToLeft className="frameIcon" theme="outline" size="27" fill="#749EC4" />
          <div className="frameBtnTitle">删除之前所有</div>
        </div>
        <div className="frameBtn" onClick={handleDeleteNextFrame}>
          <ToRight className="frameIcon" theme="outline" size="27" fill="#749EC4" />
          <div className="frameBtnTitle">删除之后所有</div>
        </div>
      </div>
      <div className="subTitle">帧</div>
    </div>
  );
};

export default Frame;
