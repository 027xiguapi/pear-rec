import React, { useRef, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Modal, message } from 'antd';
import { CameraOutlined } from '@ant-design/icons';
import {
  BsRecordCircle,
  BsMic,
  BsMicMute,
  BsPlayFill,
  BsPause,
  BsFillStopFill,
} from 'react-icons/bs';
import ininitApp from '../../pages/main';
import { useApi } from '../../api';
import { useUserApi } from '../../api/user';
import { saveAs } from 'file-saver';
import Timer from '@pear-rec/timer';
import useTimer from '@pear-rec/timer/src/useTimer';
import '@pear-rec/timer/src/Timer/index.module.scss';
import styles from './index.module.scss';

const RecorderVideo = () => {
  const { t } = useTranslation();
  const api = useApi();
  const userApi = useUserApi();
  const userRef = useRef({} as any);
  const previewVideo = useRef<HTMLVideoElement>();
  const mediaStream = useRef<MediaStream>();
  const mediaRecorder = useRef<MediaRecorder>(); // 媒体录制器对象
  const recordedChunks = useRef<Blob[]>([]); // 存储录制的音频数据
  const audioTrack = useRef<any>(); // 音频轨道对象
  const [isPause, setIsPause] = useState(false); // 标记是否暂停
  const [isRecording, setIsRecording] = useState(false); // 标记是否正在录制
  const [isMute, setIsMute] = useState(false); // 标记是否静音
  const isSave = useRef<boolean>(false);
  const timer = useTimer();

  useEffect(() => {
    window.isOffline || userRef.current.id || getCurrentUser();
  }, []);

  async function getCurrentUser() {
    try {
      const res = (await userApi.getCurrentUser()) as any;
      if (res.code == 0) {
        userRef.current = res.data;
      }
    } catch (err) {
      console.log(err);
    }
  }

  function startRecording() {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        previewVideo.current!.srcObject = stream;
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
          isSave.current && exportRecording();
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
      console.log('录像已暂停');
    }
  }

  // 恢复录制
  function resumeRecording() {
    if (isPause && mediaRecorder.current.state === 'paused') {
      mediaRecorder.current.resume();
      setIsPause(false);
      timer.resume();
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
      console.log('录像完成！');
    }
  }
  // 导出录制的音频文件
  function saveRecording() {
    stopRecording();
    isSave.current = true;
  }

  // 导出录制的音频文件
  function exportRecording() {
    if (recordedChunks.current.length > 0) {
      const blob = new Blob(recordedChunks.current, { type: 'video/webm' });
      const url = URL.createObjectURL(blob);
      window.isOffline ? saveAs(url, `pear-rec_${+new Date()}.webm`) : saveFile(blob);
    }
  }

  async function saveFile(blob) {
    try {
      const formData = new FormData();
      formData.append('type', 'rv');
      formData.append('userId', userRef.current.id);
      formData.append('file', blob);
      const res = (await api.saveFile(formData)) as any;
      if (res.code == 0) {
        if (window.isElectron) {
          window.electronAPI?.sendRvCloseWin();
          window.electronAPI?.sendVvOpenWin({ videoUrl: res.data.filePath });
        } else {
          Modal.confirm({
            title: '录像已保存，是否查看？',
            content: `${res.data.filePath}`,
            okText: t('modal.ok'),
            cancelText: t('modal.cancel'),
            onOk() {
              window.open(`/viewVideo.html?videoUrl=${res.data.filePath}`);
              console.log('OK');
            },
            onCancel() {
              console.log('Cancel');
            },
          });
        }
      }
    } catch (err) {
      message.error('保存失败');
    }
  }

  function handleShotScreen() {
    window.electronAPI?.sendRvShotScreen();
  }

  function handleToggleMute() {
    isMute ? unmuteRecording() : muteRecording();
  }

  return (
    <div className={styles.recorderVideo}>
      { isRecording ? <></> : <div className="tip">点击下面按钮开始录像</div> }
        <video className={isRecording ? "content" : "hide"} ref={previewVideo} playsInline autoPlay />
      <div className="footer">
        <BsRecordCircle className={'recordIcon ' + `${isRecording ? 'blink' : ''}`} />
        <CameraOutlined
          rev={undefined}
          className={'recordIcon shotScreenBtn'}
          onClick={handleShotScreen}
        />
        <div className="drgan"></div>
        <Timer
          seconds={timer.seconds}
          minutes={timer.minutes}
          hours={timer.hours}
          className="timer"
        />
        <div className="recorderTools">
          {!isSave ? (
            <Button type="text" loading>
              {t('recorderVideo.saving')}...
            </Button>
          ) : isRecording ? (
            <>
              <Button
                type="text"
                icon={<BsPause />}
                className="toolbarIcon pauseBtn"
                title={t('recorderVideo.pause')}
                onClick={pauseRecording}
              />
              <Button
                className={`toolbarIcon toggleMuteBtn ${isMute ? '' : 'muted'}`}
                type="text"
                onClick={handleToggleMute}
                icon={isMute ? <BsMicMute /> : <BsMic />}
                title={isMute ? t('recorderVideo.unmute') : t('recorderVideo.mute')}
              />
              <Button
                type="text"
                icon={<BsFillStopFill />}
                className="toolbarIcon stopBtn"
                title={t('recorderVideo.save')}
                onClick={saveRecording}
              />
            </>
          ) : (
            <>
              <span className="toolbarTitle">{t('recorderVideo.play')}</span>
              <Button
                type="text"
                icon={<BsPlayFill />}
                className="toolbarIcon playBtn"
                title={t('recorderVideo.play')}
                onClick={startRecording}
              ></Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

ininitApp(RecorderVideo);

export default RecorderVideo;
