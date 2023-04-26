import React, { useEffect, useState } from "react";
import ScreenShot from "js-web-screen-shot";
import { IpcEvents } from "@/ipcEvents";
import "./index.scss";

async function getDesktopCapturerSource() {
  return await window.electronAPI?.ipcRenderer.invoke(
    IpcEvents.EV_SEND_DESKTOP_CAPTURER_SOURCE,
    []
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

const ShotScreen = () => {
  const [screenShotImg, setScreenShotImg] = useState("");
  let isShoting = false;

  useEffect(() => {
    window.electronAPI?.ipcRenderer.send(
      IpcEvents.EV_SET_TITLE,
      "截图|梨子REC"
    );
    document.addEventListener("keydown", handleKeydown);
  }, []);

  useEffect(() => {
    screenShotImg && clipboardScreenShotImg();
    screenShotImg && closeScreenShot();
  }, [screenShotImg]);

  async function doScreenShot() {
    // 下面这两块自己考虑
    const sources = await getDesktopCapturerSource(); // 这里返回的是设备上的所有窗口信息
    // 这里可以对`sources`数组下面id进行判断  找到当前的electron窗口  这里为了简单直接拿了第一个
    const stream = await getInitStream(
      // sources.filter((e: any) => e.name == "截图|梨子REC")[0]
      sources.filter((e: any) => e.id == "screen:0:0")[0]
    );

    new ScreenShot({
      enableWebRtc: true, // 启用webrtc
      screenFlow: stream!, // 传入屏幕流数据
      level: 999,
      completeCallback: (screenShotImg: string) => {
        setScreenShotImg(screenShotImg);
      },
      closeCallback: () => {
        closeScreenShot();
      },
    });
  }

  function closeScreenShot() {
    isShoting = false;
    window.electronAPI?.ipcRenderer.send(IpcEvents.EV_CLOSE_SHOT_SCREEN_WIN);
  }

  function clipboardScreenShotImg() {
    window.electronAPI?.setClipboardImg(screenShotImg);
  }

  function handleKeydown(event: any) {
    if ((event.metaKey || event.altKey) && event.code === "KeyQ" && !isShoting) {
      isShoting = true;
      doScreenShot();
    }
  }

  return (
    <div className="shotScreen">
      <button type="button" onClick={doScreenShot}>
        截图
      </button>
      <button onClick={closeScreenShot}> 取消 </button>
      <button onClick={clipboardScreenShotImg}>复制</button>
    </div>
  );
};

export default ShotScreen;
