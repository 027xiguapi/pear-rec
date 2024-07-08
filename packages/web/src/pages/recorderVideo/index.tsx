import { ExclamationCircleFilled } from '@ant-design/icons';
import { AVCanvas } from '@webav/av-canvas';
import {
  ImgClip,
  MediaStreamClip,
  VisibleSprite,
  createEl,
  renderTxt2ImgBitmap,
} from '@webav/av-cliper';
import { AVRecorder } from '@webav/av-recorder';
import { Button, Card, Divider, Flex, Modal, message } from 'antd';
import { saveAs } from 'file-saver';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { db, defaultUser } from '../../db';
import initApp from '../main';
import styles from './index.module.scss';

let avCvs: AVCanvas | null = null;
function initCvs(attchEl: HTMLDivElement | null) {
  if (attchEl == null) return;
  avCvs = new AVCanvas(attchEl, {
    bgColor: '#333',
    width: 1920,
    height: 1080,
  });
  avCvs.play({ start: 0, end: Infinity });
}

let recorder: AVRecorder | null = null;

export default function UI() {
  const { t } = useTranslation();
  const [user, setUser] = useState({} as any);
  const outputStream = useRef<any>();
  const [stateText, setStateText] = useState('');

  useEffect(() => {
    user.id || getCurrentUser();
    window.electronAPI?.sendRvFile((file) => {
      addRecord(file);
    });
    return () => {
      avCvs?.destroy();
    };
  }, []);

  useEffect(() => {
    (async () => {
      // if (outputStream.current == null) return;
      // const opfsFile = await mp4StreamToOPFSFile(outputStream.current);
      // window.isOffline ? saveAs(opfsFile, `pear-rec_${+new Date()}.mp4`) : saveFile(opfsFile);
    })();
  }, [outputStream.current]);

  async function getCurrentUser() {
    try {
      let user = await db.users.where({ userType: 1 }).first();
      if (!user) {
        user = defaultUser;
        await db.users.add(user);
      }
      setUser(user);
    } catch (err) {
      console.log(err);
      Modal.confirm({
        title: '数据库错误，是否重置数据库?',
        icon: <ExclamationCircleFilled />,
        content: err.message,
        okText: '确定',
        okType: 'danger',
        cancelText: '取消',
        async onOk() {
          console.log('OK');
          await db.delete();
          location.reload();
        },
        onCancel() {
          console.log('Cancel');
        },
      });
    }
  }

  async function addRecord(file) {
    try {
      const record = {
        fileName: file.fileName,
        filePath: file.filePath,
        fileData: file.fileData,
        fileType: 'rv',
        userId: user.id,
        createdAt: new Date(),
        createdBy: user.id,
        updatedAt: new Date(),
        updatedBy: user.id,
      };
      const recordId = await db.records.add(record);
      if (recordId) {
        window.electronAPI?.sendNotification({ title: '保存成功', body: '可以在历史中查看' });
      }
    } catch (err) {
      console.log('保存失败');
    }
  }

  async function saveFile(blob) {
    const fileName = `pear-rec_${+new Date()}.mp4`;
    if (window.isElectron) {
      const url = URL.createObjectURL(blob);
      window.electronAPI.sendRvDownloadVideo({ url, fileName: fileName });
    } else {
      saveAs(blob, fileName);
      addRecord({ fileData: blob, fileName: fileName });
    }
  }

  async function start() {
    if (avCvs == null) return;
    const fileHandle = await window.showSaveFilePicker({
      suggestedName: `WebAV-${Date.now()}.mp4`,
    });
    const writer = await fileHandle.createWritable();
    recorder = new AVRecorder(avCvs.captureStream(), {
      bitrate: 5e6,
    });
    recorder.start().pipeTo(writer).catch(console.error);
  }

  async function loadFile(accept: Record<string, string[]>) {
    const [fileHandle] = await (window as any).showOpenFilePicker({
      types: [{ accept }],
    });
    return (await fileHandle.getFile()) as File;
  }

  return (
    <>
      添加素材：
      <Button
        onClick={async () => {
          if (avCvs == null) return;
          const spr = new VisibleSprite(
            new MediaStreamClip(
              await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true,
              }),
            ),
          );
          await avCvs.addSprite(spr);
        }}
      >
        Camera & Micphone
      </Button>
      &nbsp;
      <Button
        onClick={async () => {
          if (avCvs == null) return;
          const spr = new VisibleSprite(
            new MediaStreamClip(
              await navigator.mediaDevices.getDisplayMedia({
                video: true,
                audio: true,
              }),
            ),
          );
          await avCvs.addSprite(spr);
        }}
      >
        Share screen
      </Button>
      &nbsp;
      <Button
        onClick={async () => {
          if (avCvs == null) return;
          const localFile = await loadFile({
            'image/*': ['.png', '.gif', '.jpeg', '.jpg'],
          });
          const opts = /\.gif$/.test(localFile.name)
            ? ({ type: 'image/gif', stream: localFile.stream() } as const)
            : localFile.stream();
          const spr = new VisibleSprite(new ImgClip(opts));
          await avCvs.addSprite(spr);
        }}
      >
        Image
      </Button>
      &nbsp;
      <Button
        onClick={async () => {
          if (avCvs == null) return;
          const videoEl = createEl('video') as HTMLVideoElement;
          videoEl.src = URL.createObjectURL(
            await loadFile({ 'video/*': ['.webm', '.mp4', '.mov', '.mkv'] }),
          );
          videoEl.loop = true;
          videoEl.autoplay = true;
          await videoEl.play();

          const spr = new VisibleSprite(
            // @ts-ignore
            new MediaStreamClip(videoEl.captureStream()),
          );
          await avCvs.addSprite(spr);
        }}
      >
        Video
      </Button>
      &nbsp;
      <Button
        onClick={async () => {
          if (avCvs == null) return;
          const audioEl = createEl('audio') as HTMLAudioElement;
          audioEl.src = URL.createObjectURL(
            await loadFile({ 'video/*': ['.mp3', '.wav', '.ogg', '.m4a'] }),
          );
          audioEl.loop = true;
          audioEl.autoplay = true;
          await audioEl.play();

          const spr = new VisibleSprite(
            // @ts-ignore
            new MediaStreamClip(audioEl.captureStream()),
          );
          await avCvs.addSprite(spr);
        }}
      >
        Audio
      </Button>
      &nbsp;
      <Button
        onClick={async () => {
          if (avCvs == null) return;
          const spr = new VisibleSprite(
            new ImgClip(await renderTxt2ImgBitmap('示例文字', 'font-size: 80px; color: red;')),
          );
          await avCvs.addSprite(spr);
        }}
      >
        Text
      </Button>
      <hr />
      <Button
        onClick={async () => {
          await start();
          setStateText('录制中...');
        }}
      >
        Start Recod
      </Button>
      &nbsp;
      <Button
        onClick={async () => {
          await recorder?.stop();
          setStateText('视频已保存');
        }}
      >
        Stop Recod
      </Button>
      <span style={{ marginLeft: 16, color: '#666' }}>{stateText}</span>
      <div ref={initCvs} style={{ width: 900, height: 500, position: 'relative' }} />
    </>
  );
}

async function loadFile(accept: Record<string, string[]>) {
  const [fileHandle] = await (window as any).showOpenFilePicker({
    types: [{ accept }],
  });
  return await fileHandle.getFile();
}

initApp(UI);
