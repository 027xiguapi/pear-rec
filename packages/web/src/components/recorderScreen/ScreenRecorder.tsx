import { CameraOutlined, ExclamationCircleFilled, DesktopOutlined } from '@ant-design/icons';
import Timer from '@pear-rec/timer';
import useTimer from '@pear-rec/timer/src/useTimer';
import { mp4StreamToOPFSFile } from '@webav/av-cliper';
import { AVRecorder } from '@webav/av-recorder';
import { Button, Modal } from 'antd';
import { saveAs } from 'file-saver';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BsRecordCircle } from 'react-icons/bs';
import { db, defaultUser } from '../../db';
import PauseRecorder from './PauseRecorder';
import PlayRecorder from './PlayRecorder';
import StopRecorder from './StopRecorder';
import MicMuteRecorder from './MicMuteRecorder';
import SoundMuteRecorder from './SoundMuteRecorder';
import FullScreen from './FullScreen';
import ShotScreen from './ShotScreen';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';

const ScreenRecorder = (props) => {
  const { t } = useTranslation();
  const [user, setUser] = useState({} as any);
  const timer = useTimer();
  const videoRef = useRef<HTMLVideoElement>();
  const mediaStream = useRef<MediaStream>(); // 视频和系统声音流
  const micStream = useRef<MediaStream>(); // 麦克风声音流
  const combinedStream = useRef<MediaStream>(); // 合并流
  const mediaRecorder = useRef<AVRecorder | null>(); // 媒体录制器对象
  const outputStream = useRef<any>();
  const recordedChunks = useRef<Blob[]>([]); // 存储录制的音频数据
  const recordedUrl = useRef<string>(''); // 存储录制的音频数据
  const [isRecording, setIsRecording] = useState(false); // 标记是否正在录制
  const [isSave, setIsSave] = useState(false);
  // const isSave = useRef<boolean>(false);
  const [percent, setPercent] = useState(0);
  const [isLoad, setIsLoad] = useState(false);
  const ffmpegRef = useRef(new FFmpeg());

  const paramsString = location.search;
  const searchParams = new URLSearchParams(paramsString);
  const type = searchParams.get('type');
  const worker = new Worker(new URL('./worker.js', import.meta.url), { name: 'Crop worker' });

  useEffect(() => {
    if (window.isElectron) {
      initElectron();
    } else {
      initCropArea();
    }
    loadFfmpeg();
    user.id || getCurrentUser();
    return () => {
      mediaRecorder.current?.stop();
    };
  }, []);

  useEffect(() => {
    (async () => {
      if (outputStream.current == null) return;
      const opfsFile = await mp4StreamToOPFSFile(outputStream.current);
      type == 'gif' ? transcodeGif(opfsFile) : saveFile(opfsFile);
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

  async function initElectron() {
    const sources = await window.electronAPI?.invokeRsGetDesktopCapturerSource();
    const source = sources.filter((e: any) => e.id == 'screen:0:0')[0] || sources[0];
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
    mediaStream.current = await navigator.mediaDevices.getUserMedia(constraints);
    return mediaStream.current;
  }

  async function initCropArea() {
    try {
      const innerCropArea = document.querySelector('#innerCropArea');
      const cropTarget = await (window as any).CropTarget.fromElement(innerCropArea);
      mediaStream.current = await navigator.mediaDevices.getDisplayMedia({
        preferCurrentTab: true,
      } as any);
      const [videoTrack] = mediaStream.current.getVideoTracks();
      await (videoTrack as any).cropTo(cropTarget);
      micStream.current = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      micStream.current
        ?.getAudioTracks()
        .forEach((audioTrack) => mediaStream.current?.addTrack(audioTrack));
      videoRef.current.srcObject = mediaStream.current;
    } catch (err) {
      console.log('initCropArea', err);
    }
  }

  async function cropStream() {
    const size = await window.electronAPI?.invokeRsGetBoundsClip();
    const [track] = mediaStream.current.getVideoTracks();
    // @ts-ignore
    const processor = new MediaStreamTrackProcessor({ track });
    const { readable } = processor;
    // @ts-ignore
    const generator = new MediaStreamTrackGenerator({ kind: 'video' });
    const { writable } = generator;
    const videoStream = new MediaStream([generator]);
    videoRef.current.srcObject = videoStream;

    worker.postMessage(
      {
        operation: 'crop',
        readable,
        writable,
        size,
        status: 'start',
      },
      [readable, writable],
    );

    worker.addEventListener('message', function (message) {
      worker.terminate();
    });

    micStream.current = await navigator.mediaDevices.getUserMedia({
      audio: true,
    });
    // 使用Web Audio API来捕获系统声音和麦克风声音，将它们合并到同一个MediaStream中。
    const audioCtx = new window.AudioContext();
    const systemSoundSource = audioCtx.createMediaStreamSource(mediaStream.current);
    const systemSoundDestination = audioCtx.createMediaStreamDestination();
    systemSoundSource.connect(systemSoundDestination);
    const micSoundSource = audioCtx.createMediaStreamSource(micStream.current);
    micSoundSource.connect(systemSoundDestination);
    // 合并音频流与视频流
    combinedStream.current = new MediaStream([
      ...videoStream.getVideoTracks(),
      ...systemSoundDestination.stream.getAudioTracks(),
    ]);
  }

  async function setMediaRecorder() {
    if (window.isElectron) {
      await cropStream();
    } else {
      combinedStream.current = mediaStream.current;
    }
    const recodeMS = combinedStream.current.clone();
    const size = window.isElectron ? await window.electronAPI?.invokeRsGetBoundsClip() : props.size;
    mediaRecorder.current = new AVRecorder(recodeMS, { width: size.width, height: size.height });
  }

  function handleShotScreen() {
    const { width, height } = props.size;
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext('2d');
    context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    const url = canvas.toDataURL('image/png');
    saveAs(url, `pear-rec_${+new Date()}.png`);
  }

  // 开始录制
  async function handleStartRecord() {
    await setMediaRecorder();
    await mediaRecorder.current.start();
    outputStream.current = mediaRecorder.current.outputStream;

    setIsRecording(true);
    props.setIsRecording && props.setIsRecording(true);
    timer.start();
  }

  // 暂停录制
  function handlePauseRecord() {
    mediaRecorder.current.pause();
    timer.pause();
  }

  // 恢复录制
  function handleResumeRecord() {
    mediaRecorder.current.resume();
    timer.resume();
  }

  // 停止录制，并将录制的音频数据导出为 Blob 对象
  async function handleStopRecord() {
    setIsSave(true);
    timer.reset();
    if (isRecording) {
      await mediaRecorder.current.stop();
      setIsRecording(false);
    }
    worker.postMessage({
      status: 'stop',
    });
  }

  async function loadFfmpeg() {
    const baseURL = window.isElectron ? './ffmpeg@0.12.5' : '/ffmpeg@0.12.5';
    const ffmpeg = ffmpegRef.current;
    ffmpeg.on('log', ({ message }) => {
      // console.log('log', message);
    });
    ffmpeg.on('progress', (res) => {
      console.log('progress', res);
      let { progress } = res;
      setPercent(Number((progress * 100).toFixed(0)));
    });
    await ffmpeg.load({
      coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
      wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
      workerURL: await toBlobURL(`${baseURL}/ffmpeg-core.worker.js`, 'text/javascript'),
    });
    setIsLoad(true);
  }

  async function transcodeGif(video) {
    if (isLoad) {
      const ffmpeg = ffmpegRef.current;
      const input = 'input.mov';
      const output = `pear-rec_${+new Date()}.gif`;
      await ffmpeg.writeFile(input, await fetchFile(video));
      let rule = [];
      rule.push('-i', input, '-vf', `fps=${10},scale=-1:-1`, '-c:v', 'gif', output);
      console.log(rule);
      await ffmpeg.exec(rule);
      const fileData = await ffmpeg.readFile(output);
      const data = new Uint8Array(fileData as ArrayBuffer);
      let blob = new Blob([data.buffer], { type: 'image/gif' });
      await ffmpeg.deleteFile(input);
      await ffmpeg.deleteFile(output);
      saveFile(blob);
    } else {
      console.log('软件未加载完');
    }
  }

  async function saveFile(blob) {
    try {
      const fileName = `pear-rec_${+new Date()}.${type == 'gif' ? 'gif' : 'mp4'}`;
      const record = {
        fileName: fileName,
        fileData: blob,
        fileType: 'rs',
        userId: user.id,
        createdAt: new Date(),
        createdBy: user.id,
        updatedAt: new Date(),
        updatedBy: user.id,
      };
      const recordId = await db.records.add(record);
      if (recordId) {
        setIsSave(false);
        if (window.isElectron) {
          saveAs(blob, fileName);
        } else {
          Modal.confirm({
            title: '录屏已保存，是否查看？',
            content: `${record.fileName}`,
            okText: t('modal.ok'),
            cancelText: t('modal.cancel'),
            onOk() {
              type == 'gif'
                ? window.open(`/editGif.html?recordId=${recordId}`)
                : window.open(`/viewImage.html?recordId=${recordId}`);
            },
          });
        }
      }
    } catch (err) {
      console.log('保存失败', err);
    }
  }

  return (
    <div className="screenRecorder">
      <video ref={videoRef} className="hide" playsInline autoPlay />
      <div>
        <div className={`toolbarIcon recordBtn ${isRecording ? 'blink' : ''}`}>
          <BsRecordCircle />
        </div>
        <div>录制</div>
      </div>
      <div className="info">
        <Timer
          seconds={timer.seconds}
          minutes={timer.minutes}
          hours={timer.hours}
          isShowTitle={false}
          className="timer"
        />
        <div className="tool">
          <FullScreen isRecording={isRecording} />
          <ShotScreen onShotScreen={handleShotScreen} />
          <MicMuteRecorder isRecording={isRecording} />
          <SoundMuteRecorder isRecording={isRecording} />
        </div>
      </div>
      {isSave ? (
        <Button type="text" loading>
          {t('recorderScreen.saving')}...
        </Button>
      ) : isRecording ? (
        <>
          <PauseRecorder pauseRecord={handlePauseRecord} resumeRecord={handleResumeRecord} />
          <StopRecorder stopRecord={handleStopRecord} />
        </>
      ) : (
        <PlayRecorder startRecord={handleStartRecord} />
      )}
    </div>
  );
};

export default ScreenRecorder;
