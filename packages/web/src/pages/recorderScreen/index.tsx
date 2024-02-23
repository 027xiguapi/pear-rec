import '@pear-rec/timer/src/Timer/index.module.scss';
import { useRef, useState } from 'react';
import CropRecorder from '../../components/recorderScreen/CropRecorder';
import ScreenRecorder from '../../components/recorderScreen/ScreenRecorder';
import SelectMedia from '../../components/recorderScreen/SelectMedia';
import ininitApp from '../../pages/main';
import styles from './index.module.scss';

const RecorderScreen = () => {
  const videoRef = useRef(null);
  const iframeRef = useRef(null);
  const [isIframe, setIsIframe] = useState(true);
  const [isMedia, setIsMedia] = useState(false);

  function setMediaStream(mediaStream) {
    videoRef.current!.srcObject = mediaStream;
    setIsIframe(false);
    setIsMedia(true);
  }

  function setIframeRef(value) {
    iframeRef.current.src = value;
    setIsIframe(true);
    setIsMedia(true);
  }

  return (
    <div className={styles.recorderScreen}>
      {window.isElectron ? (
        <ScreenRecorder />
      ) : (
        <>
          {isMedia ? (
            <CropRecorder />
          ) : (
            <SelectMedia setIframeRef={setIframeRef} setMediaStream={setMediaStream} />
          )}
          <iframe
            ref={iframeRef}
            className={`iframeRef ${isIframe ? 'show' : 'hide'}`}
            src=""
            width={'100%'}
            height={'100%'}
            frameBorder="0"
          ></iframe>
          <video
            ref={videoRef}
            className={`videoRef ${isIframe ? 'hide' : 'show'}`}
            autoPlay
            muted
            playsInline
          ></video>
        </>
      )}
    </div>
  );
};

ininitApp(RecorderScreen);
export default RecorderScreen;
