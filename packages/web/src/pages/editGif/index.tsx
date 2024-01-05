import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ininitApp from '../../pages/main';
import { useUserApi } from '../../api/user';
import { useApi } from '../../api/index';
import { Local } from '../../util/storage';
import GifConverter from '../../components/editGif/GifConverter';
import { UserContext } from '../../components/context/UserContext';
import { GifContext } from '../../components/context/GifContext';
import styles from './index.module.scss';

const paramsString = location.search;
const searchParams = new URLSearchParams(paramsString);
const EditGif = () => {
  const userApi = useUserApi();
  const api = useApi();
  const { t } = useTranslation();
  const [videoUrl, setVideoUrl] = useState('');
  const [filePath, setFilePath] = useState('');
  const [imgUrl, setImgUrl] = useState('');
  const [user, setUser] = useState(Local.get('user') || ({} as any));
  const [videoFrames, setVideoFrames] = useState([]);
  const [frameDuration, setFrameDuration] = useState(100);
  const videoFramesRef = useRef([]);
  const indexRef = useRef(0);

  useEffect(() => {
    window.isOffline || getCurrentUser();
    init();
  }, []);

  useEffect(() => {
    filePath && loadFilePath();
  }, [filePath]);

  useEffect(() => {
    videoUrl && loadVideo();
  }, [videoUrl]);

  useEffect(() => {
    imgUrl && loadImg();
  }, [imgUrl]);

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

    _videoUrl && setVideoUrl(_videoUrl);
    _filePath && setFilePath(_filePath);
    _imgUrl && setImgUrl(_imgUrl);
  }

  async function loadFilePath() {
    loadVideoFrames();
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
      const imageByteStream = await fetchImageByteStream(imgUrl);
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
        frameIndex + 1 >= frameCount && setVideoFrames(_videoFrames);
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
    let _videoUrl = videoUrl;
    if (videoUrl && videoUrl.substring(0, 4) != 'blob') {
      _videoUrl = `${window.baseURL}file?url=${videoUrl}`;
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

  async function loadVideoFrames() {
    const _videoFrames = Local.get('videoFrames');
    setVideoFrames(_videoFrames);
  }

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
      }}
    >
      <GifContext.Provider
        value={{
          videoFrames,
          setVideoFrames,
          frameDuration,
          setFrameDuration,
          videoFramesRef,
          indexRef,
          setFilePath,
          setImgUrl,
        }}
      >
        <div className={`${styles.editGif} ${window.isElectron ? styles.electron : styles.web}`}>
          <GifConverter />
        </div>
      </GifContext.Provider>
    </UserContext.Provider>
  );
};

ininitApp(EditGif);

export default EditGif;
