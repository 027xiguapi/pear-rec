import React, { useEffect, useState } from "react";
import ScreenShot from "js-web-screen-shot";
import { IpcEvents } from "@/ipcEvents";
import "./index.scss";

async function getDesktopCapturerSource() {
  return await window.electronAPI?.ipcRenderer.invoke(
    IpcEvents.EV_SEND_DESKTOP_CAPTURER_SOURCE);
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
    doScreenShot();
  }, []);

  useEffect(() => {
    screenShotImg && clipboardScreenShotImg();
    screenShotImg && closeScreenShot();
  }, [screenShotImg]);

  async function doScreenShot() {
    if (isShoting) return;
    isShoting = true;
    const sources = await getDesktopCapturerSource();
    const stream = await getInitStream(
      sources.filter((e: any) => e.id == "screen:0:0")[0]
    );

    new ScreenShot({
      enableWebRtc: true,
      screenFlow: stream!,
      level: 999,
      completeCallback: (screenShotImg: string) => {
        completeScreenShot(screenShotImg);
      },
      closeCallback: () => {
        closeScreenShot();
      },
    });
  }

  function completeScreenShot(screenShotImg: any) {
    setScreenShotImg(screenShotImg);
  }

  function closeScreenShot() {
    isShoting = false;
    window.electronAPI?.ipcRenderer.send(IpcEvents.EV_CLOSE_SHOT_SCREEN_WIN);
  }

  function clipboardScreenShotImg() {
    window.electronAPI?.setClipboardImg(screenShotImg);
  }

  return <div className="shotScreen"></div>;
};

export default ShotScreen;
