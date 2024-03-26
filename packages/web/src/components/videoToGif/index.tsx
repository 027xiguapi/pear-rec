import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';
import { Button, Flex, InputNumber, Modal, Progress, Slider } from 'antd';
import { useEffect, useRef, useState } from 'react';
import styles from './index.module.scss';

let defaultTime = [0, 10];
let videoInfo = {} as any;
let videoUrl = '';

export default function MP4Converter(props) {
  const inputVideo0Ref = useRef(null);
  const inputVideo1Ref = useRef(null);
  const inputImg0Ref = useRef(null);
  const inputImg1Ref = useRef(null);
  const [duration, setDuration] = useState(0);
  const [frameNum, setFrameNum] = useState(0);
  const [time, setTime] = useState(defaultTime);
  const [fps, setFps] = useState(10);
  const [percent, setPercent] = useState(0);
  const [isLoad, setIsLoad] = useState(false);
  const ffmpegRef = useRef(new FFmpeg());

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    if (props.video) {
      videoUrl = URL.createObjectURL(props.video);
      init(videoUrl);
    }
  }, [props.video]);

  useEffect(() => {
    if (props.videoUrl) {
      videoUrl = props.videoUrl;
      init(videoUrl);
    }
  }, [props.videoUrl]);

  function init(videoUrl) {
    videoInfo = loadVideo(videoUrl);
    setDuration(videoInfo.duration);
    defaultTime[1] >= videoInfo.duration && (defaultTime[1] = Math.floor(videoInfo.duration));
    handleTimeChange(defaultTime);
  }

  async function load() {
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

  const handleTranscode = async () => {
    if (isLoad) {
      const ffmpeg = ffmpegRef.current;
      const input = 'input.mov';
      const output = `pear-rec_${+new Date()}.gif`;
      await ffmpeg.writeFile(input, await fetchFile(videoUrl));
      let rule = [];
      rule.push('-ss', `${time[0]}`);
      rule.push('-t', `${time[1] - time[0]}`);
      rule.push('-i', input, '-vf', `fps=${fps},scale=-1:-1`, '-c:v', 'gif', output);
      console.log(rule);
      await ffmpeg.exec(rule);
      const fileData = await ffmpeg.readFile(output);
      const data = new Uint8Array(fileData as ArrayBuffer);
      let imgUrl = URL.createObjectURL(new Blob([data.buffer], { type: 'image/gif' }));
      await ffmpeg.deleteFile(input);
      await ffmpeg.deleteFile(output);
      handleSave({ imgUrl, size: (data.byteLength / 1024 / 1024).toFixed(1) });
    } else {
      console.log('软件未加载完');
    }
  };

  async function loadVideo(videoUrl) {
    return new Promise(async function (resolve, reject) {
      inputVideo0Ref.current.src = videoUrl;
      inputVideo1Ref.current.src = videoUrl;
      inputVideo0Ref.current.onloadedmetadata = function () {
        let mp4Dur = Number(inputVideo0Ref.current.duration.toFixed(2));
        videoInfo = {
          duration: mp4Dur,
          width: inputVideo0Ref.current.videoWidth,
          heighe: inputVideo0Ref.current.videoHeight,
        };
        resolve(videoInfo);
      };
    });
  }

  async function handleTimeChange(time) {
    setTime(time);
    setFrameNum(Number((fps * (time[1] - time[0])).toFixed(0)));
    setInputImgs(time);
  }

  function setInputImgs(time) {
    inputVideo0Ref.current.currentTime = time[0] || 0.1;
    inputVideo0Ref.current.onseeked = function () {
      const canvas0 = inputImg0Ref.current;
      const context0 = canvas0.getContext('2d');
      context0.drawImage(inputVideo0Ref.current, 0, 0, canvas0.width, canvas0.height);
    };

    inputVideo1Ref.current.currentTime = time[1];
    inputVideo1Ref.current.onseeked = function () {
      const canvas1 = inputImg1Ref.current;
      const context1 = canvas1.getContext('2d');
      context1.drawImage(inputVideo1Ref.current, 0, 0, canvas1.width, canvas1.height);
    };
  }

  function handleTimeStart(timeStart) {
    setTime((time) => [timeStart, time[1]]);
  }

  function handleTimeEnd(timeEnd) {
    setTime((time) => [time[0], timeEnd]);
  }

  function handleFps(val) {
    setFps(val);
  }

  function handleSave(img) {
    const _img = {
      src: img.imgUrl,
      name: `pear-rec_${+new Date()}.gif`,
      duration: (time[1] - time[0]).toFixed(1),
      frameNum: frameNum,
      width: videoInfo.width,
      heighe: videoInfo.heighe,
      size: img.size,
    };
    img.imgUrl && props.onSave(_img);
  }

  return (
    <div className={styles.converter}>
      <div className="content">
        <div className="input input1">
          <canvas className="img" ref={inputImg0Ref} />
          <video className="video hide" ref={inputVideo0Ref} />
        </div>
        <div className="input input2">
          <canvas className="img" ref={inputImg1Ref} />
          <video className="video hide" ref={inputVideo1Ref} />
        </div>
      </div>
      {duration === 0 ? (
        'loading...'
      ) : (
        <div className="slider">
          <span> 时间：</span>
          <div className="sliderInput">
            <Slider
              min={0}
              max={videoInfo.duration}
              step={0.1}
              defaultValue={defaultTime}
              range={{ draggableTrack: true }}
              onChangeComplete={handleTimeChange}
            />
          </div>
          <span>{videoInfo.duration}s</span>
        </div>
      )}
      <div className="fileGroup setting">
        <div className="item frameSize">
          <div className="title">大小: </div>
          宽度: {videoInfo.width}px 高度: {videoInfo.heighe}px
        </div>
        <div className="item frameDuration">
          <div className="title">时长: </div>
          {videoInfo.duration}s
        </div>
        <div className="item fps">
          <div className="title">帧速率: </div>
          <InputNumber size="small" value={fps} onChange={handleFps} /> FPS
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
        <Button type="primary" onClick={handleTranscode}>
          转换
        </Button>
      </Flex>
    </div>
  );
}
