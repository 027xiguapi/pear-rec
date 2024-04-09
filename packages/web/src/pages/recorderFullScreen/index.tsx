import { CloseOutlined, ExclamationCircleFilled } from '@ant-design/icons';
import { CameraOne } from '@icon-park/react';
import Timer from '@pear-rec/timer';
import '@pear-rec/timer/src/Timer/index.module.scss';
import useTimer from '@pear-rec/timer/src/useTimer';
import { Button, Modal, message } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BsFillStopFill, BsPause, BsPlayFill, BsRecordCircle } from 'react-icons/bs';
import { db, defaultUser } from '../../db';
import { saveAs } from 'file-saver';
import ininitApp from '../../pages/main';
import styles from './index.module.scss';

const RecorderScreen = () => {
  const { t } = useTranslation();
  const videoRef = useRef<HTMLVideoElement>();
  const mediaStream = useRef<MediaStream>();
  const micStream = useRef<MediaStream>(); // 声音流
  const mediaRecorder = useRef<MediaRecorder>(); // 媒体录制器对象
  const recordedChunks = useRef<Blob[]>([]); // 存储录制的音频数据
  const audioTrack = useRef<any>(); // 音频轨道对象
  const [isPause, setIsPause] = useState(false); // 标记是否暂停
  const [isRecording, setIsRecording] = useState(false); // 标记是否正在录制
  const [isMute, setIsMute] = useState(false); // 标记是否静音
  const [isSave, setIsSave] = useState(false); // 标记是否正在保存
  const timer = useTimer();
  const [user, setUser] = useState<any>({});

  useEffect(() => {
    user.id || getCurrentUser();
  }, []);

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

  function handleStartRecording() {
    startRecordingElectron();
  }

  function startRecordingWeb() {
    navigator.mediaDevices
      .getDisplayMedia({ video: true, audio: true })
      .then((stream) => {
        videoRef.current!.srcObject = stream;
        mediaStream.current = stream;
        audioTrack.current = stream.getAudioTracks()[0];
        audioTrack.current.enabled = true; // 开启音频轨道
        mediaRecorder.current = new MediaRecorder(stream);
        mediaRecorder.current.addEventListener('dataavailable', (e) => {
          if (e.data.size > 0) {
            recordedChunks.current.push(e.data);
          }
        });
        mediaRecorder.current.addEventListener('stop', () => {
          exportRecording();
        });
        mediaRecorder.current.start();
        setIsRecording(true);
        timer.start();
        console.log('开始录像...');
      })
      .catch((error) => {
        console.error('无法获取媒体权限：', error);
      });
  }

  // 静音录制
  function muteRecording() {
    if (audioTrack.current) {
      audioTrack.current.enabled = false; // 关闭音频轨道
      setIsMute(true);
      console.log('录像已静音');
    }
  }

  // 取消静音
  function unmuteRecording() {
    if (audioTrack.current) {
      audioTrack.current.enabled = true; // 开启音频轨道
      setIsMute(false);
      console.log('取消静音');
    }
  }

  // 暂停录制
  function pauseRecording() {
    if (!isPause && mediaRecorder.current.state === 'recording') {
      mediaRecorder.current.pause();
      setIsPause(true);
      timer.pause();
      window.electronAPI?.sendRsPauseRecord();
      console.log('录像已暂停');
    }
  }

  // 恢复录制
  function resumeRecording() {
    if (isPause && mediaRecorder.current.state === 'paused') {
      mediaRecorder.current.resume();
      setIsPause(false);
      timer.start();
      window.electronAPI?.sendRsStartRecord();
      console.log('恢复录像...');
    }
  }

  // 停止录制，并将录制的音频数据导出为 Blob 对象
  function stopRecording() {
    if (isRecording) {
      mediaRecorder.current.stop();
      mediaStream.current?.getTracks().forEach((track) => track.stop());
      setIsRecording(false);
      timer.reset();
      recordedChunks.current = [];
      window.electronAPI?.sendRsStopRecord();
      console.log('录像完成！');
    }
  }
  // 导出录制的音频文件
  function saveRecording() {
    setIsSave(true);
    stopRecording();
  }

  // 导出录制的音频文件
  function exportRecording() {
    if (recordedChunks.current.length > 0) {
      const blob = new Blob(recordedChunks.current, {
        type: 'video/webm',
      });
      saveFile(blob);
    }
  }

  async function saveFile(blob) {
    try {
      const fileName = `pear-rec_${+new Date()}.webm`;
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
        saveAs(blob, fileName);
      }
    } catch (err) {
      message.error('保存失败');
    }
  }

  function handleToggleMute() {
    isMute ? unmuteRecording() : muteRecording();
  }

  async function startRecordingElectron() {
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
    // 使用Web Audio API来捕获系统声音和麦克风声音，将它们合并到同一个MediaStream中。
    const audioCtx = new window.AudioContext();
    const systemSoundSource = audioCtx.createMediaStreamSource(mediaStream.current);
    const systemSoundDestination = audioCtx.createMediaStreamDestination();
    systemSoundSource.connect(systemSoundDestination);

    micStream.current = await navigator.mediaDevices.getUserMedia({
      audio: true,
    });
    const micSoundSource = audioCtx.createMediaStreamSource(micStream.current);
    micSoundSource.connect(systemSoundDestination);
    // 合并音频流与视频流
    const combinedSource = new MediaStream([
      ...mediaStream.current.getVideoTracks(),
      ...systemSoundDestination.stream.getAudioTracks(),
    ]);

    mediaRecorder.current = new MediaRecorder(combinedSource);
    mediaRecorder.current.addEventListener('dataavailable', (e) => {
      if (e.data.size > 0) {
        recordedChunks.current.push(e.data);
      }
    });
    mediaRecorder.current.addEventListener('stop', () => {
      exportRecording();
    });
    mediaRecorder.current.start();
    setIsRecording(true);
    timer.start();
    console.log('开始录像...');
  }

  function handleOpenSettingWin() {
    window.electronAPI ? window.electronAPI.sendSeOpenWin() : (location.href = '/setting.html');
  }

  function handleShotScreen() {
    const canvas = document.createElement('canvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const context = canvas.getContext('2d');
    context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    const url = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = url;
    link.download = `pear-rec_${+new Date()}.png`;
    link.click();
  }

  function handleTogglePause() {
    isPause ? resumeRecording() : pauseRecording();
  }

  function handleCloseWin() {
    window.electronAPI?.sendRfsCloseWin();
  }

  function handleOpenPinVideoWin() {
    window.electronAPI?.sendPvOpenWin();
  }

  return (
    <div className={styles.recorderFullScreen}>
      <div className={'recordTool ' + `${isRecording ? 'recording' : ''}`}>
        <BsRecordCircle className={'recordIcon ' + `${isRecording && !isPause ? 'blink' : ''}`} />
        {/* <Button
          type="text"
          icon={<SettingOutlined />}
          className="toolbarIcon settingBtn"
          title={t('nav.setting')}
          onClick={handleOpenSettingWin}
        ></Button> */}
        <Button
          type="text"
          icon={<CameraOne theme="outline" size="22" fill="#333" strokeWidth={3} />}
          className="toolbarIcon cameraBtn"
          title={t('nav.camera')}
          onClick={handleOpenPinVideoWin}
        ></Button>
        <Button
          type="text"
          icon={<CloseOutlined />}
          className="toolbarIcon closeBtn"
          title={t('nav.close')}
          onClick={handleCloseWin}
        ></Button>
        {/* <Button
          type="text"
          icon={<CameraOutlined />}
          className="toolbarIcon shotScreenBtn"
          title={t('recorderScreen.shotScreen')}
          onClick={handleShotScreen}
        ></Button> */}
        <Timer
          seconds={timer.seconds}
          minutes={timer.minutes}
          hours={timer.hours}
          className="timer"
        />
        <div className="recorderTools">
          {isSave ? (
            <Button type="text" loading>
              {t('recorderScreen.saving')}...
            </Button>
          ) : isRecording ? (
            <>
              <Button
                type="text"
                icon={isPause ? <BsPlayFill /> : <BsPause />}
                className="toolbarIcon pauseBtn"
                title={isPause ? t('recorderScreen.resume') : t('recorderScreen.pause')}
                onClick={handleTogglePause}
              />
              {/* <Button
              className={`toolbarIcon toggleMuteBtn ${isMute ? '' : 'muted'}`}
              type="text"
              onClick={handleToggleMute}
              icon={isMute ? <BsMicMute /> : <BsMic />}
              title={isMute ? t('recorderScreen.unmute') : t('recorderScreen.mute')}
            /> */}
              <Button
                type="text"
                icon={<BsFillStopFill />}
                className="toolbarIcon stopBtn"
                title={t('recorderScreen.save')}
                onClick={saveRecording}
              />
            </>
          ) : (
            <>
              <span className="toolbarTitle">{t('recorderScreen.play')}</span>
              <Button
                type="text"
                icon={<BsPlayFill />}
                className="toolbarIcon playBtn"
                title={t('recorderScreen.play')}
                onClick={handleStartRecording}
              ></Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

ininitApp(RecorderScreen);
