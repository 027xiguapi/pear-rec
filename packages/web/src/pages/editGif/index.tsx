import { useEffect, useReducer, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useApi } from '../../api/index';
import { useUserApi } from '../../api/user';
import { GifContext, gifInitialState, gifReducer } from '../../components/context/GifContext';
import {
  HistoryContext,
  historyInitialState,
  historyReducer,
} from '../../components/context/HistoryContext';
import { UserContext } from '../../components/context/UserContext';
import GifConverter from '../../components/editGif/GifConverter';
import ininitApp from '../../pages/main';
import { Local } from '../../util/storage';
import styles from './index.module.scss';

const paramsString = location.search;
const searchParams = new URLSearchParams(paramsString);
const EditGif = () => {
  const userApi = useUserApi();
  const api = useApi();
  const { t } = useTranslation();
  const [user, setUser] = useState(Local.get('user') || ({} as any));
  const [historyState, historyDispatch] = useReducer(historyReducer, historyInitialState);
  const [gifState, gifDispatch] = useReducer(gifReducer, gifInitialState);

  useEffect(() => {
    window.isOffline || getCurrentUser();
    init();
  }, []);

  useEffect(() => {
    gifState.filePath && loadFilePath();
  }, [gifState.filePath]);

  useEffect(() => {
    gifState.videoUrl && loadVideo();
  }, [gifState.videoUrl]);

  useEffect(() => {
    gifState.imgUrl && loadImg();
  }, [gifState.imgUrl]);

  async function getCurrentUser() {
    const res = (await userApi.getCurrentUser()) as any;
    if (res.code == 0) {
      const user = res.data;
      setUser(user);
      Local.set('user', user);
    }
  }

  async function init() {
    let _videoUrl = searchParams.get('videoUrl');
    let _filePath = searchParams.get('filePath');
    let _imgUrl = searchParams.get('imgUrl');

    _videoUrl && gifDispatch({ type: 'setVideoUrl', videoUrl: _videoUrl });
    _imgUrl && gifDispatch({ type: 'setImgUrl', imgUrl: _imgUrl });
    _filePath && gifDispatch({ type: 'setFilePath', filePath: _filePath });
  }

  async function loadFilePath() {
    gifDispatch({ type: 'setVideoFrames', videoFrames: Local.get('videoFrames') });
  }

  async function fetchImageByteStream(imgUrl: string) {
    if (imgUrl.substring(0, 4) != 'blob') {
      imgUrl = `${window.baseURL}file?url=${imgUrl}`;
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
    const res = (await api.deleteFileCache('cg')) as any;
    if (res.code == 0) {
      const imageByteStream = await fetchImageByteStream(gifState.imgUrl);
      const imageDecoder = await createImageDecoder(imageByteStream);
      const frameCount = imageDecoder.tracks.selectedTrack!.frameCount;
      let _videoFrames = [];
      for (let frameIndex = 0; frameIndex < frameCount; frameIndex++) {
        const { image: imageFrame } = await imageDecoder.decode({ frameIndex });
        const frameDuration = imageFrame.duration! / 1000;
        const filePath = await saveImg(imageFrame, frameIndex);

        imageFrame.close();
        _videoFrames.push({
          url: `${window.baseURL}file?url=${filePath}`,
          filePath: filePath,
          index: frameIndex,
          duration: frameDuration,
        });
        gifDispatch({ type: 'setLoad', load: Math.round(((frameIndex + 1) / frameCount) * 100) });
        frameIndex + 1 >= frameCount &&
          gifDispatch({ type: 'setVideoFrames', videoFrames: _videoFrames });
      }
    }
  }

  async function saveImg(videoFrame, frameIndex) {
    const canvas = new OffscreenCanvas(videoFrame.displayWidth, videoFrame.displayHeight);
    const context = canvas.getContext('2d');
    context.drawImage(videoFrame, 0, 0);
    const blob = await canvas.convertToBlob({ type: 'image/jpeg' });
    return await uploadFileCache(blob);
  }

  async function uploadFileCache(blob) {
    let formData = new FormData();
    formData.append('type', 'cg');
    formData.append('file', blob);
    formData.append('userId', user.id);

    const res = (await api.uploadFileCache(formData)) as any;
    if (res.code == 0) {
      return res.data;
    }
  }

  function loadVideo() {
    let _videoUrl = gifState.videoUrl;
    if (_videoUrl && _videoUrl.substring(0, 4) != 'blob') {
      _videoUrl = `${window.baseURL}file?url=${gifState.videoUrl}`;
    }
    fetch(_videoUrl)
      .then((response) => response.blob())
      .then((blob) => {
        const _recordedUrl = URL.createObjectURL(blob);
        // setRecordedUrl(_recordedUrl);
      })
      .catch((error) => {
        console.error('Failed to download and play video:', error);
      });
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
          </div>
        </GifContext.Provider>
      </HistoryContext.Provider>
    </UserContext.Provider>
  );
};

ininitApp(EditGif);

export default EditGif;
