import React, { useState, useRef, useEffect } from "react";
import useMediaRecorder from "renderer/components/useMediaRecorder";
import { IpcEvents } from "@/ipcEvents";
import "./index.scss";

async function getDesktopCapturerSource() {
  return await window.electronAPI?.ipcRenderer.invoke(
    IpcEvents.EV_GET_ALL_DESKTOP_CAPTURER_SOURCE
  );
}

async function getInitStream(
  source: { id: string },
  audio?: boolean
): Promise<MediaStream | null> {
  return new Promise((resolve, _reject) => {
    (navigator.mediaDevices as any)
      .getUserMedia({
        audio: audio
          ? {
              mandatory: {
                chromeMediaSource: "desktop",
              },
            }
          : false,
        video: {
          mandatory: {
            chromeMediaSource: "desktop",
            chromeMediaSourceId: source.id,
          },
        },
      })
      .then((stream: MediaStream) => {
        resolve(stream);
      })
      .catch((error: any) => {
        console.log(error);
        resolve(null);
      });
  });
}

const RecorderScreen = () => {
  const [source, setSource] = useState({});

  useEffect(() => {
    window.electronAPI?.ipcRenderer.send(
      IpcEvents.EV_SET_TITLE,
      "录屏|梨子REC"
    );
    doScreenRecorder();
  }, []);

  const previewVideo = useRef<HTMLVideoElement>(null);

  async function doScreenRecorder() {
    const sources = await getDesktopCapturerSource();
    setSource(sources.filter((e: any) => e.id == "screen:0:0")[0]);
  }

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
    desktop: true,
    source: source,
    onStop: (url: string) => alert(`录屏完成，${url}`),
  });

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

export default RecorderScreen;
