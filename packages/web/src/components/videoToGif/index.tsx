import { MP4Previewer } from '@webav/av-cliper';
import { ExclamationCircleFilled } from '@ant-design/icons';
import { Button, Flex, InputNumber, Progress, Slider, Modal } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { db, defaultUser } from '../../db';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';
import styles from './converter.module.scss';

let defaultTime = [0, 3];
let previewer;
let mp4Info = {} as any;

export default function MP4Converter(props) {
  const videoRef = useRef(null);
  const [imgStartSrc, setImgStartSrc] = useState('');
  const [imgEndSrc, setImgEndSrc] = useState('');
  const [duration, setDuration] = useState(0);
  const [frameNum, setFrameNum] = useState(0);
  const [time, setTime] = useState(defaultTime);
  const [fps, setFps] = useState(33);
  const [percent, setPercent] = useState(0);
  const [user, setUser] = useState<any>({});
  const ffmpegRef = useRef(new FFmpeg());
  const messageRef = useRef<HTMLParagraphElement | null>(null);

  useEffect(() => {
    user.id || getCurrentUser();
    load();
  }, []);

  useEffect(() => {
    if (props.videoUrl) {
      (async () => {
        await start(props.videoUrl);
        let mp4Info = (await loadVideo(props.videoUrl)) as any;
        setDuration(mp4Info.duration);
        defaultTime[1] >= mp4Info.duration && (defaultTime[1] = Math.floor(mp4Info.duration));
        handleTimeChange(defaultTime);
      })();
    }
  }, [props.videoUrl]);

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

  async function load() {
    const baseURL = 'http://localhost:9191/ffmpeg';
    // const baseURL = 'https://unpkg.com/@ffmpeg/core-mt@0.12.6/dist/esm';
    const ffmpeg = ffmpegRef.current;
    ffmpeg.on('log', ({ message }) => {
      // messageRef.current.innerHTML = message;
      console.log(message);
    });
    await ffmpeg.load({
      coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
      wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
    });
  }

  const transcode = async () => {
    console.log(66);
    const ffmpeg = ffmpegRef.current;
    await ffmpeg.writeFile('input.webm', await fetchFile('/ffmpeg/Big_Buck_Bunny_180_10s.webm'));
    console.log(55);
    await ffmpeg.exec(['-i', 'input.webm', 'output.mp4']);
    const fileData = await ffmpeg.readFile('output.mp4');
    const data = new Uint8Array(fileData as ArrayBuffer);
    if (videoRef.current) {
      videoRef.current.src = URL.createObjectURL(new Blob([data.buffer], { type: 'video/mp4' }));
    }
  };

  async function start(videoUrl) {
    let stream = (await fetch(videoUrl)).body!;
    previewer = new MP4Previewer(stream);
    // let i = await previewer.getInfo();
  }

  async function loadVideo(videoUrl) {
    return new Promise(async function (resolve, reject) {
      db.caches.where('fileType').equals('cg').delete();
      videoRef.current.src = videoUrl;
      videoRef.current.onloadedmetadata = function () {
        let mp4Dur = Number(videoRef.current.duration.toFixed(2));
        mp4Info = {
          duration: mp4Dur,
          width: videoRef.current.videoWidth,
          heighe: videoRef.current.videoHeight,
        };
        resolve(mp4Info);
      };
    });
  }

  async function handleTimeChange(time) {
    setTime(time);
    setImgStartSrc(await previewer.getImage(time[0]));
    setImgEndSrc(await previewer.getImage(time[1]));
    setFrameNum(Number((fps * (time[1] - time[0])).toFixed(0)));
  }

  function handleTimeStart(timeStart) {
    setTime((time) => [timeStart, time[1]]);
  }

  function handleTimeEnd(timeEnd) {
    setTime((time) => [time[0], timeEnd]);
  }

  function handleFps() {}

  async function handleSubmit() {
    for (let i = 0; i < frameNum; i++) {
      let _time = Number((time[0] * 1000 + (1000 / fps) * i).toFixed(0)) / 1000;
      setPercent(Number((((i + 1) * 100) / frameNum).toFixed(0)));
      let imgUrl = await previewer.getImage(_time);
      await uploadFileCache(imgUrl);
      i == frameNum - 1 && props.onOk();
    }
  }

  function handleCancel() {
    props.onCancel();
  }

  async function uploadFileCache(imgUrl) {
    const response = await fetch(imgUrl);
    const blob = await response.blob();
    const cache = {
      fileName: `pear-rec_${+new Date()}.png`,
      fileData: blob,
      fileType: 'cg',
      duration: Number((1000 / fps).toFixed(0)),
      userId: user.id,
      createdAt: new Date(),
      createdBy: user.id,
      updatedAt: new Date(),
      updatedBy: user.id,
    };
    await db.caches.add(cache);
    URL.revokeObjectURL(imgUrl);
  }

  return (
    <div className={styles.converter}>
      <video ref={videoRef} playsInline autoPlay />
      <div className="frames">
        {imgStartSrc && <img src={imgStartSrc} className="frame imgStart" />}
        {imgEndSrc && <img src={imgEndSrc} className="frame imgEnd" />}
      </div>
      {duration === 0 ? (
        'loading...'
      ) : (
        <div className="slider">
          <span> 时间：</span>
          <div className="sliderInput">
            <Slider
              min={0}
              max={duration}
              step={0.1}
              defaultValue={defaultTime}
              range={{ draggableTrack: true }}
              onChangeComplete={handleTimeChange}
            />
          </div>
          <span>{duration}s</span>
        </div>
      )}
      <div className="fileGroup setting">
        <div className="item frameSize">
          <div className="title">大小: </div>
          宽度: {mp4Info.width}px 高度: {mp4Info.heighe}px
        </div>
        <div className="item frameDuration">
          <div className="title">时长: </div>
          {mp4Info.duration}s
        </div>
        <div className="item fps">
          <div className="title">帧速率: </div>
          <InputNumber size="small" disabled value={fps} onChange={handleFps} /> FPS
        </div>
        <div className="item timeStart">
          <div className="title">开始时间: </div>
          <InputNumber size="small" disabled value={time[0]} onChange={handleTimeStart} /> s
        </div>
        <div className="item timeEnd">
          <div className="title">结束时间: </div>
          <InputNumber size="small" disabled value={time[1]} onChange={handleTimeEnd} /> s
        </div>
        <div className="item frameInfo">
          <div className="title">选择: </div>
          帧数: {frameNum} 持续时间: {(time[1] - time[0]).toFixed(1)}s
        </div>
      </div>
      <div className="progress">{percent ? <Progress percent={percent} /> : ''}</div>
      <Flex gap="small" wrap="wrap" justify="right" className="footer">
        <Button type="primary" onClick={load}>
          加载
        </Button>
        <Button type="primary" onClick={transcode}>
          确定
        </Button>
        <Button onClick={handleCancel}>取消</Button>
      </Flex>
    </div>
  );
}
