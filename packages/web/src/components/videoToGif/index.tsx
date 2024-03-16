import { ExclamationCircleFilled } from '@ant-design/icons';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';
import { MP4Previewer } from '@webav/av-cliper';
import { Button, Flex, InputNumber, Modal, Progress, Slider } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { db, defaultUser } from '../../db';
import styles from './index.module.scss';

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
  const [isLoad, setIsLoad] = useState(false);
  const ffmpegRef = useRef(new FFmpeg());

  useEffect(() => {
    user.id || getCurrentUser();
    load();
  }, []);

  useEffect(() => {
    console.log(props.videoUrl);
    if (props.videoUrl) {
      mp4Info = loadVideo(props.videoUrl);
      setDuration(mp4Info.duration);
      defaultTime[1] >= mp4Info.duration && (defaultTime[1] = Math.floor(mp4Info.duration));
      handleTimeChange(defaultTime);
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
    const baseURL = '/ffmpeg@0.12.5';
    // const baseURL = 'https://unpkg.com/@ffmpeg/core-mt@0.12.6/dist/esm';
    // const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd';
    const ffmpeg = ffmpegRef.current;
    ffmpeg.on('log', ({ message }) => {
      // messageRef.current.innerHTML = message;
      console.log('log', message);
    });
    ffmpeg.on('progress', ({ progress }) => {
      console.log('progress', progress);
    });
    await ffmpeg.load({
      coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
      wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
      workerURL: await toBlobURL(`${baseURL}/ffmpeg-core.worker.js`, 'text/javascript'),
    });
    setIsLoad(true);
  }

  const transcode = async () => {
    if (isLoad) {
      const ffmpeg = ffmpegRef.current;
      const videoUrl = props.videoUrl;
      const input = 'input.mov';
      const output = 'pear-rec_1709102672477.gif';
      await ffmpeg.writeFile(input, await fetchFile(videoUrl));
      let rule = ['-i', input, '-vf', 'fps=16,scale=-1:-1', '-c:v', 'gif', output];
      // m && (g.push("-ss", `${m[0]}`),
      // g.push("-t", `${m[1] - m[0]}`)),
      // g.push("-i", "input.mov", "-vf", `fps=16,scale=${d}:-1`, "-c:v", "gif", f),
      console.log(rule);
      await ffmpeg.exec(rule);
      const fileData = await ffmpeg.readFile(output);
      const data = new Uint8Array(fileData as ArrayBuffer);
      let _videoUrl = URL.createObjectURL(new Blob([data.buffer], { type: 'image/gif' }));

      await ffmpeg.deleteFile(input);
      await ffmpeg.deleteFile(output);
    }
  };

  async function loadVideo(videoUrl) {
    return new Promise(async function (resolve, reject) {
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
      <video ref={videoRef} className="hide" playsInline autoPlay />
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
