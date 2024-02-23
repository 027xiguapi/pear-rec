import Timer from '@pear-rec/timer';
import useTimer from '@pear-rec/timer/src/useTimer';
import { Card, Divider, Radio, Select, Space, Switch } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import WaveSurfer from 'wavesurfer.js';
import UploadAudio from '../upload/UploadAudio';
import RecordPlugin from './plugins/record';

const AudioRecorder = (props) => {
  const { t } = useTranslation();
  const timer = useTimer();
  const micRef = useRef();
  const audioInputOptions = useRef<any>();
  const mimeTypesOptions = useRef<any>();
  const [record, setRecord] = useState<any>(null);
  const [isOpenMic, setIsOpenMic] = useState(false);
  const [recordStatus, setRecordStatus] = useState('');
  const [deviceId, setDeviceId] = useState('');
  const [mimeType, setMimeType] = useState('audio/webm');

  useEffect(() => {
    if (!micRef.current) return;
    const wavesurfer = WaveSurfer.create({
      container: micRef.current,
      waveColor: 'rgb(200, 0, 200)',
      progressColor: 'rgb(100, 0, 100)',
    });

    const record = wavesurfer.registerPlugin(RecordPlugin.create({ mimeType }) as any);

    record.getEnumerateDevices().then((deviceInfos) => {
      let _audioInputOptions = [
        {
          value: '',
          label: '全部',
        },
      ];
      for (let i = 0; i < deviceInfos.length; i++) {
        const deviceInfo = deviceInfos[i];
        if (deviceInfo.kind == 'audioinput') {
          _audioInputOptions.push({
            value: deviceInfo.deviceId,
            label: deviceInfo.label || `microphone ${_audioInputOptions.length + 1}`,
          });
        }
      }
      audioInputOptions.current = _audioInputOptions;
    });

    const mimeTypes = record.getSupportedMimeTypes();
    let _mimeTypesOptions = [];
    for (let i = 0; i < mimeTypes.length; i++) {
      const mimeType = mimeTypes[i];
      _mimeTypesOptions.push({
        value: mimeType,
        label: mimeType,
      });
    }
    mimeTypesOptions.current = _mimeTypesOptions;

    record.on('record-start', () => {
      console.log('record-start');
      timer.start();
      setRecordStatus('start');
    });

    record.on('record-end', async (blob) => {
      console.log('record-end');
      timer.reset();
      setRecordStatus('stop');
      const recordedUrl = URL.createObjectURL(blob);
      const duration = await record.getDuration(blob);
      const type = blob.type.split(';')[0].split('/')[1] || 'webm';
      const createdAt = dayjs().format();
      const audio = {
        url: recordedUrl,
        name: `${createdAt}.${type}`,
        type: type,
        createdAt: createdAt,
        duration,
      };
      props.onSetAudios((prevState) => [audio, ...prevState]);
    });

    record.on('record-pause', () => {
      console.log('record-pause');
      timer.pause();
      setRecordStatus('pause');
    });

    record.on('record-resume', () => {
      console.log('record-resume');
      timer.resume();
      setRecordStatus('resume');
    });
    setRecord(record);
  }, [micRef]);

  function startRecord() {
    record.startRecording(deviceId);
  }

  function stopRecord() {
    record.stopRecording();
  }

  function closeMic() {
    setIsOpenMic(false);
    record.stopMic();
  }

  function openMic() {
    setIsOpenMic(true);
    record.startMic(deviceId);
  }

  function pauseRecord() {
    record.pauseRecording();
  }

  function resumeRecord() {
    record.resumeRecording();
  }

  function changeMic(checked) {
    checked ? openMic() : closeMic();
  }

  async function handleUploadAudios(files) {
    for (let i = 0; i < files.length; i++) {
      let file = files[i];
      const duration = await record.getDuration(file);
      const url = window.URL.createObjectURL(file);
      const createdAt = dayjs(file.lastModifiedDate).format();
      const type = file.type;
      const audio = {
        url: url,
        name: file.name,
        type: type,
        createdAt: createdAt,
        duration: duration,
      };
      props.onSetAudios((prevState) => [audio, ...prevState]);
    }
  }

  function handleChangeSource(value) {
    setDeviceId(value);
    isOpenMic && record.startMic(value);
  }

  function handleChangeMimeType(value) {
    setMimeType(value);
  }

  return (
    <Card title="设置">
      <Space>
        麦克风
        <Switch checkedChildren="开启" unCheckedChildren="关闭" onChange={changeMic} />
        音源
        <Select
          defaultValue=""
          style={{ width: 120 }}
          onChange={handleChangeSource}
          options={audioInputOptions.current}
        />
        格式
        <Select
          defaultValue="audio/webm"
          style={{ width: 120 }}
          onChange={handleChangeMimeType}
          options={mimeTypesOptions.current}
        />
        计时
        <Timer
          seconds={timer.seconds}
          minutes={timer.minutes}
          hours={timer.hours}
          isShowTitle={false}
        />
        <UploadAudio handleUploadAudios={handleUploadAudios} />
      </Space>
      <Divider />
      <Space>
        操作
        <Radio.Group buttonStyle="solid" disabled={!isOpenMic} value={recordStatus}>
          <Radio.Button value="start" onClick={startRecord}>
            开始
          </Radio.Button>
          <Radio.Button value="stop" onClick={stopRecord}>
            保存
          </Radio.Button>
          <Radio.Button value="pause" onClick={pauseRecord}>
            暂停
          </Radio.Button>
          <Radio.Button value="resume" onClick={resumeRecord}>
            继续
          </Radio.Button>
        </Radio.Group>
        声波
        <Radio.Group buttonStyle="solid" value={'WaveView'}>
          <Radio.Button value="WaveView">WaveView</Radio.Button>
          <Radio.Button value="SurferView" disabled>
            SurferView
          </Radio.Button>
          <Radio.Button value="Histogram" disabled>
            Histogram
          </Radio.Button>
        </Radio.Group>
      </Space>
      <Divider />
      <div id="mic" ref={micRef}></div>
    </Card>
  );
};

export default AudioRecorder;
