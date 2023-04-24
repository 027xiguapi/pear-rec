import React, { useState, useRef } from "react";
import useMediaRecorder from "../../components/useMediaRecorder";
import "./index.scss";

const RecordScreen = () => {
  const {
    mediaUrl,
    isMuted,
    startRecord,
    resumeRecord,
    pauseRecord,
    stopRecord,
    clearBlobUrl,
    getMediaStream,
    toggleMute,
  } = useMediaRecorder({
    audio: true,
    screen: true,
    onStop: (url: string) => alert(`录屏完成，${url}`),
  });

  const previewVideo = useRef<HTMLVideoElement>(null);

  return (
    <div>
      <h2>录屏</h2>
      <video src={mediaUrl} controls />

      <video ref={previewVideo} controls />

      <button
        onClick={() =>
          (previewVideo.current.srcObject = getMediaStream() || null)
        }
      >
        预览
      </button>

      <button onClick={startRecord}>开始</button>
      <button onClick={pauseRecord}>暂停</button>
      <button onClick={resumeRecord}>恢复</button>
      <button onClick={stopRecord}>停止</button>
      <button onClick={() => toggleMute(!isMuted)}>
        {isMuted ? "打开声音" : "禁音"}
      </button>
      <button onClick={clearBlobUrl}>清除 URL</button>
    </div>
  );
};

export default RecordScreen;
