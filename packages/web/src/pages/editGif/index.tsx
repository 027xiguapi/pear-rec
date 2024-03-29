import { ExclamationCircleFilled } from '@ant-design/icons';
import { Modal } from 'antd';
import { useEffect, useReducer, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { GifContext, gifInitialState, gifReducer } from '../../components/context/GifContext';
import {
  HistoryContext,
  historyInitialState,
  historyReducer,
} from '../../components/context/HistoryContext';
import { UserContext } from '../../components/context/UserContext';
import GifConverter from '../../components/editGif/GifConverter';
import { db, defaultUser } from '../../db';
import ininitApp from '../../pages/main';
import styles from './index.module.scss';

const paramsString = location.search;
const searchParams = new URLSearchParams(paramsString);
const EditGif = () => {
  const { t } = useTranslation();
  const [user, setUser] = useState<any>({});
  const [historyState, historyDispatch] = useReducer(historyReducer, historyInitialState);
  const [gifState, gifDispatch] = useReducer(gifReducer, gifInitialState);

  useEffect(() => {
    user.id || getCurrentUser();
    init();
  }, []);

  // useEffect(() => {
  //   gifState.videoUrl && loadVideo();
  // }, [gifState.videoUrl]);

  useEffect(() => {
    gifState.imgUrl && loadImg();
  }, [gifState.imgUrl]);

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

  async function init() {
    let _videoUrl = searchParams.get('videoUrl');
    let _imgUrl = searchParams.get('imgUrl');
    let recordId = searchParams.get('recordId');

    _videoUrl && gifDispatch({ type: 'setVideoUrl', videoUrl: _videoUrl });
    _imgUrl && gifDispatch({ type: 'setImgUrl', imgUrl: _imgUrl });
    if (recordId) {
      let record = await db.records.where({ id: Number(recordId) }).first();
      gifDispatch({ type: 'setVideoUrl', videoUrl: URL.createObjectURL(record.fileData) });
    }
  }

  async function fetchImageByteStream(imgUrl: string) {
    if (imgUrl.substring(0, 7) != 'pearrec' && imgUrl.substring(0, 4) != 'blob') {
      imgUrl = `pearrec://${imgUrl}`;
    }
    const response = await fetch(imgUrl);
    return response.body!;
  }

  async function createImageDecoder(imageByteStream: ReadableStream<Uint8Array>) {
    const imageDecoder = new (window as any).ImageDecoder({
      data: imageByteStream,
      type: 'image/gif',
    });
    await imageDecoder.tracks.ready;
    await imageDecoder.completed;
    return imageDecoder;
  }

  async function loadImg() {
    await db.caches.where('fileType').equals('cg').delete();
    const imageByteStream = await fetchImageByteStream(gifState.imgUrl);
    const imageDecoder = await createImageDecoder(imageByteStream);
    const frameCount = imageDecoder.tracks.selectedTrack!.frameCount;
    for (let frameIndex = 0; frameIndex < frameCount; frameIndex++) {
      const { image: imageFrame } = await imageDecoder.decode({ frameIndex });
      const frameDuration = imageFrame.duration! / 1000;
      await saveImg(imageFrame, frameIndex);
      imageFrame.close();
      gifDispatch({ type: 'setLoad', load: Math.round(((frameIndex + 1) / frameCount) * 100) });
    }
    setVideoFrames();
  }

  async function setVideoFrames() {
    let _videoFrames = await db.caches.where('fileType').equals('cg').toArray();
    gifDispatch({ type: 'setVideoFrames', videoFrames: _videoFrames });
    gifDispatch({ type: 'setFrameNum', frameNum: _videoFrames.length });
    gifDispatch({ type: 'setIndex', index: 0 });
  }

  async function saveImg(videoFrame, frameIndex) {
    const frameDuration = videoFrame.duration! / 1000;
    const canvas = new OffscreenCanvas(videoFrame.displayWidth, videoFrame.displayHeight);
    const context = canvas.getContext('2d');
    context.drawImage(videoFrame, 0, 0);
    const blob = await canvas.convertToBlob({ type: 'image/png' });
    await uploadFileCache(blob, frameDuration);
  }

  async function uploadFileCache(blob, frameDuration) {
    const cache = {
      fileName: `pear-rec_${+new Date()}.png`,
      fileData: blob,
      fileType: 'cg',
      duration: frameDuration,
      userId: user.id,
      createdAt: new Date(),
      createdBy: user.id,
      updatedAt: new Date(),
      updatedBy: user.id,
    };
    await db.caches.add(cache);
  }

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
      }}
    >
      <HistoryContext.Provider value={{ historyState, historyDispatch }}>
        <GifContext.Provider value={{ gifState, gifDispatch }}>
          <div className={`${styles.editGif} ${window.isElectron ? styles.electron : styles.web}`}>
            <GifConverter />
            <canvas id="canvas" className="hide"></canvas>
          </div>
        </GifContext.Provider>
      </HistoryContext.Provider>
    </UserContext.Provider>
  );
};

ininitApp(EditGif);

export default EditGif;
