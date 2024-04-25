import { ExclamationCircleFilled } from '@ant-design/icons';
import { AVCanvas, AudioSprite, ImgSprite, TextSprite, VideoSprite } from '@webav/av-canvas';
import { mp4StreamToOPFSFile } from '@webav/av-cliper';
import { AVRecorder } from '@webav/av-recorder';
import { Button, Card, Divider, Flex, Modal, message } from 'antd';
import { saveAs } from 'file-saver';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { db, defaultUser } from '../../db';
import initApp from '../main';
import styles from './index.module.scss';

let avCvs: AVCanvas | null = null;
let recorder: AVRecorder | null = null;

function initCvs(attchEl: HTMLDivElement | null) {
  if (attchEl == null) return;
  avCvs = new AVCanvas(attchEl, {
    bgColor: '#333',
    resolution: {
      width: 1920,
      height: 1080,
    },
  });
}

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
      if (outputStream.current == null) return;
      const opfsFile = await mp4StreamToOPFSFile(outputStream.current);
      window.isOffline ? saveAs(opfsFile, `pear-rec_${+new Date()}.mp4`) : saveFile(opfsFile);
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
    recorder = new AVRecorder(avCvs.captureStream(), {
      width: 1920,
      height: 1080,
      bitrate: 5e6,
      audioCodec: 'aac',
    });
    await recorder.start();
    outputStream.current = recorder.outputStream;
    setStateText('录制中...');
  }

  return (
    <div className={styles.recorderVideo}>
      <Card className="content">
        <Flex gap="small" wrap="wrap" className="tool">
          添加素材：
          <Button
            onClick={async () => {
              if (avCvs == null) return;
              const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true,
              });
              const vs = new VideoSprite('userMedia', mediaStream, {
                audioCtx: avCvs.spriteManager.audioCtx,
              });
              await avCvs.spriteManager.addSprite(vs);
            }}
          >
            摄像 & 麦克风
          </Button>
          <Button
            onClick={async () => {
              if (avCvs == null) return;

              const source = await window.electronAPI?.invokeRsGetDesktopCapturerSource();
              const constraints: any = {
                audio: {
                  mandatory: {
                    chromeMediaSource: 'desktop',
                  },
                },
                video: {
                  mandatory: {
                    chromeMediaSource: 'desktop',
                    chromeMediaSourceId: source.id,
                  },
                },
              };
              const mediaStream = window.isElectron
                ? await navigator.mediaDevices.getUserMedia(constraints)
                : await navigator.mediaDevices.getDisplayMedia({
                    video: true,
                    audio: true,
                  });
              const vs = new VideoSprite('display', mediaStream, {
                audioCtx: avCvs.spriteManager.audioCtx,
              });
              await avCvs.spriteManager.addSprite(vs);
            }}
          >
            屏幕
          </Button>
          <Button
            onClick={async () => {
              if (avCvs == null) return;
              const is = new ImgSprite(
                'img',
                await loadFile({ 'image/*': ['.png', '.gif', '.jpeg', '.jpg'] }),
              );
              await avCvs.spriteManager.addSprite(is);
            }}
          >
            图片
          </Button>
          <Button
            onClick={async () => {
              if (avCvs == null) return;
              const vs = new VideoSprite(
                'video',
                await loadFile({ 'video/*': ['.webm', '.mp4'] }),
                {
                  audioCtx: avCvs.spriteManager.audioCtx,
                },
              );
              await avCvs.spriteManager.addSprite(vs);
            }}
          >
            视频
          </Button>
          <Button
            onClick={async () => {
              if (avCvs == null) return;
              const as = new AudioSprite(
                'audio',
                await loadFile({ 'audio/*': ['.mp3', '.wav', '.ogg'] }),
                { audioCtx: avCvs.spriteManager.audioCtx },
              );
              await avCvs.spriteManager.addSprite(as);
            }}
          >
            音频
          </Button>
          <Button
            onClick={async () => {
              if (avCvs == null) return;
              const fs = new TextSprite('text', '示例文字');
              await avCvs.spriteManager.addSprite(fs);
            }}
          >
            文字
          </Button>
        </Flex>
        <Divider />
        <Flex gap="small" wrap="wrap">
          <Button
            onClick={async () => {
              await start();
            }}
          >
            开始录制
          </Button>
          <Button
            onClick={async () => {
              await recorder?.stop();
              setStateText('视频已保存');
            }}
          >
            停止录制
          </Button>
          <span style={{ marginLeft: 16, color: '#666' }}>{stateText}</span>
        </Flex>
        <div
          ref={initCvs}
          style={{ width: 900, height: 500, position: 'relative', marginTop: 20 }}
        ></div>
      </Card>
    </div>
  );
}

async function loadFile(accept: Record<string, string[]>) {
  const [fileHandle] = await (window as any).showOpenFilePicker({
    types: [{ accept }],
  });
  return await fileHandle.getFile();
}

initApp(UI);
