import React, { useState, useContext, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useApi } from '../../../api';
import { Redo, Undo, Refresh } from '@icon-park/react';
import { GifContext } from '../../context/GifContext';
import { HistoryContext } from '../../context/HistoryContext';
import styles from './history.module.scss';

const History = (props) => {
  const { t } = useTranslation();
  const { historyState, historyReducer } = useContext(HistoryContext);
  const { videoFrames, setVideoFrames, setFrameDuration, indexRef } = useContext(GifContext);

  useEffect(() => {}, []);

  function handleUndoClick() {
    historyReducer({ type: 'prev' });
  }

  function handleRedoClick() {
    historyReducer({ type: 'next' });
  }

  function handleResetClick() {
    historyReducer({ type: 'reset' });
  }

  return (
    <div className={`${styles.history}`}>
      <div className="historyList">
        <div className="historyBtn" onClick={handleUndoClick}>
          <Undo className="historyIcon" theme="outline" size="27" fill="#43CCF8" />
          <div className="historyBtnTitle">撤销</div>
        </div>
        <div className="historyBtn" onClick={handleRedoClick}>
          <Redo className="historyIcon" theme="outline" size="27" fill="#43CCF8" />
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
