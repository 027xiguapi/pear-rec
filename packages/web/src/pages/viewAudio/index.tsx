import APlayer from 'aplayer';
import 'aplayer/dist/APlayer.min.css';
import { useEffect, useRef, useState } from 'react';
import { db } from '../../db';
// import Vudio from 'vudio';
import ininitApp from '../../pages/main';
import styles from './index.module.scss';

const logo = '/imgs/icons/png/512x512.png';
const colors = [
  [
    [0, '#f00'],
    [0.3, '#f00'],
    [0.3, '#f90'],
    [0.7, '#f90'],
    [0.7, '#ff0'],
    [1, '#ff0'],
  ],
  '#ff0',
  ['#06f', '#09f', ' #0Cf', '#0ff'],
  ['#fb6d6b', '#c10056', ' #a50053', '#51074b'],
  [
    [0, '#ff422d'],
    [0.5, '#ff422d'],
    [0.5, '#6072ff'],
    [1, '#6072ff'],
  ],
];
const types = ['waveform', 'circlebar', 'lighting', 'circlewave'];
let prettify = false;

const ViewAudio = () => {
  let refPlayer = useRef<any>();
  const [audioSrc, setAudioSrc] = useState<string>('');
  const [vudio, setVudio] = useState(null);
  const audioRef = useRef<any>();
  const canvasRef = useRef<any>();

  useEffect(() => {
    audioSrc && initVudio();
  }, [audioSrc]);

  useEffect(() => {
    init();
  }, []);

  async function init() {
    const paramsString = location.search;
    const searchParams = new URLSearchParams(paramsString);
    const audioUrl = searchParams.get('audioUrl');
    const recordId = searchParams.get('recordId');
    let audioSrc = '';
    if (audioUrl) {
      if (audioUrl.substring(0, 4) == 'blob' || audioUrl.substring(0, 7) == 'pearrec') {
        audioSrc = audioUrl;
      } else {
        audioSrc = 'pearrec://' + audioUrl;
      }
    }
    if (recordId) {
      let record = await db.records.where({ id: Number(recordId) }).first();
      audioSrc = URL.createObjectURL(record.fileData);
    }
    setAudioSrc(audioSrc);
  }

  function initVudio() {
    const _vudio = new window.Vudio(audioRef.current, canvasRef.current, {
      effect: 'circlewave',
      accuracy: 128,
      width: 800,
      height: 800,
      circlebar: {
        circleRadius: 200,
        fadeSide: false,
        shadowBlur: 4,
        shadowColor: 'rgba(244,244,244,.5)',
      },
      circlewave: {
        circleRadius: 70,
        fadeSide: true,
        shadowBlur: 4,
        shadowColor: 'rgba(244,244,244,.5)',
        coverImg: logo,
      },
      waveform: {
        maxHeight: 160,
        spacing: 1,
        shadowBlur: 6,
        shadowColor: 'rgba(255,21,10,0.6)',
        prettify: true,
        fadeSide: true,
        color: [
          [0, '#f00'],
          [0.3, '#f00'],
          [0.3, '#f90'],
          [0.7, '#f90'],
          [0.7, '#ff0'],
          [1, '#ff0'],
        ],
      },
    });
    _vudio.dance();
    setVudio(_vudio);
  }

  function changeType(index) {
    vudio.setOption({
      effect: types[index],
    });
  }
  function changeColor(index) {
    vudio.setOption({
      waveform: {
        color: colors[index],
      },
      circlewave: {
        color: colors[index],
      },
      circlebar: {
        color: colors[index],
      },
      lighting: {
        color: colors[index],
      },
    });
  }
  function changePosV(type) {
    var option = {
      verticalAlign: type,
      fadeSide: true,
    };
    vudio.setOption({
      waveform: option,
      lighting: option,
    });
  }
  function changePosH(type) {
    var option = {
      horizontalAlign: type,
      fadeSide: true,
    };
    vudio.setOption({
      waveform: option,
      lighting: option,
    });
  }
  function prettifyWaveform() {
    vudio.setOption({
      waveform: {
        prettify: prettify,
      },
      circlewave: {
        prettify: prettify,
      },
      circlebar: {
        prettify: prettify,
      },
    });
    prettify = !prettify;
  }

  return (
    <div className={styles.viewAudio}>
      <div className="container">
        <img id="bg" />
        <canvas id="canvas" ref={canvasRef}></canvas>
        <audio id="audio" src={audioSrc} autoPlay ref={audioRef}></audio>
        <label className="label" id="audioLabel">
          Drop audio file here to play
        </label>
        <input
          type="file"
          name="audioFile"
          id="audioFile"
          onChange={() => vudio.readAudioSrc(this, vudio, document.querySelector('#audioLabel'))}
          accept="audio/*"
        />
      </div>
      <div className="controller">
        <div>
          <button
            onClick={() => {
              audioRef.current.play();
              console.log(vudio, audioRef.current);
              vudio.dance();
            }}
          >
            播放音乐
          </button>
          <button onClick={() => audioRef.current.pause()}>暂停音乐</button>
        </div>
        <div>
          <button onClick={() => vudio.dance()}>播放效果</button>
          <button onClick={() => vudio.pause()}>暂停效果</button>
          <button onClick={() => prettifyWaveform()}>美化效果</button>
        </div>
        <div>
          <button className="type type-1" onClick={() => changeType(0)}>
            跳舞的柱
          </button>
          <button className="type type-2" onClick={() => changeType(1)}>
            围着跳舞
          </button>
          <button className="type type-3" onClick={() => changeType(2)}>
            跳舞的线~
          </button>
          <button className="type type-4" onClick={() => changeType(3)}>
            跳舞的圈
          </button>
        </div>
        <div>
          <button className="color color-1" onClick={() => changeColor(0)}></button>
          <button className="color color-2" onClick={() => changeColor(1)}></button>
          <button className="color color-3" onClick={() => changeColor(2)}></button>
          <button className="color color-4" onClick={() => changeColor(3)}></button>
          <button className="color color-5" onClick={() => changeColor(4)}></button>
        </div>
        <div>
          <button className="pos-v" onClick={() => changePosV('top')}>
            上
          </button>
          <button className="pos-v" onClick={() => changePosV('middle')}>
            中
          </button>
          <button className="pos-v" onClick={() => changePosV('bottom')}>
            下
          </button>
        </div>
        <div>
          <button className="pos-h" onClick={() => changePosH('left')}>
            左
          </button>
          <button className="pos-h" onClick={() => changePosH('center')}>
            中
          </button>
          <button className="pos-h" onClick={() => changePosH('right')}>
            右
          </button>
        </div>
      </div>
    </div>
  );
};

ininitApp(ViewAudio);
export default ViewAudio;
