import { Button, Checkbox, Col, Divider, Modal, Row, Slider, Space, message } from 'antd';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import WaveSurfer from 'wavesurfer.js';
import { saveAs } from 'file-saver';
import { db } from '../../db';

const useWavesurfer = (containerRef, options) => {
  const [wavesurfer, setWavesurfer] = useState(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const ws = WaveSurfer.create({
      ...options,
      container: containerRef.current,
    });

    setWavesurfer(ws);

    ws.on('interaction', () => {
      ws.play();
    });

    return () => {
      ws.destroy();
    };
  }, [options, containerRef]);

  return wavesurfer;
};

const WaveSurferPlayer = (props) => {
  const { t } = useTranslation();
  const containerRef = useRef();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [scrollbar, setScrollbar] = useState(true);
  const [fillParent, setFillParent] = useState(true);
  const [autoCenter, setAutoCenter] = useState(true);
  const wavesurfer = useWavesurfer(containerRef, props);

  useEffect(() => {
    window.electronAPI?.sendRaFile((file) => {
      addRecord(file);
    });
  }, []);

  const onPlayClick = useCallback(() => {
    wavesurfer.isPlaying() ? wavesurfer.pause() : wavesurfer.play();
  }, [wavesurfer]);

  const onDownloadClick = useCallback(async () => {
    const blobUrl = wavesurfer.getMediaElement().src;

    saveFile(blobUrl);
  }, [wavesurfer]);

  async function addRecord(file) {
    try {
      const record = {
        fileName: file.fileName,
        filePath: file.filePath,
        fileData: file.fileData,
        fileType: 'ra',
        userId: props.user.id,
        createdAt: new Date(),
        createdBy: props.user.id,
        updatedAt: new Date(),
        updatedBy: props.user.id,
      };
      const recordId = await db.records.add(record);
      if (recordId) {
        window.electronAPI?.sendNotification({ title: '保存成功', body: '可以在历史中查看' });
      }
    } catch (err) {
      message.error('保存失败');
    }
  }

  async function saveFile(blobUrl) {
    const fileName = `pear-rec_${+new Date()}.webm`;
    if (window.isElectron) {
      window.electronAPI.sendRaDownloadAudio({ url: blobUrl, fileName: fileName });
    } else {
      saveAs(blobUrl, fileName);
      const data = await fetch(blobUrl);
      const blob = await data.blob();
      addRecord({ fileData: blob, fileName: fileName });
    }
  }

  const onRangeChange = useCallback(
    (minPxPerSec) => {
      wavesurfer.zoom(minPxPerSec);
    },
    [wavesurfer],
  );

  const onScrollbarChange = useCallback(
    (e) => {
      wavesurfer.setOptions({
        scrollbar: e.target.checked,
      });
      setScrollbar(e.target.checked);
    },
    [wavesurfer],
  );

  const onFillParentChange = useCallback(
    (e) => {
      wavesurfer.setOptions({
        fillParent: e.target.checked,
      });
      setFillParent(e.target.checked);
    },
    [wavesurfer],
  );

  const onAutoCenterChange = useCallback(
    (e) => {
      wavesurfer.setOptions({
        autoCenter: e.target.checked,
      });
      setAutoCenter(e.target.checked);
    },
    [wavesurfer],
  );

  useEffect(() => {
    if (!wavesurfer) return;

    setCurrentTime(0);
    setIsPlaying(false);

    const subscriptions = [
      wavesurfer.on('play', () => setIsPlaying(true)),
      wavesurfer.on('pause', () => setIsPlaying(false)),
      wavesurfer.on('timeupdate', (currentTime) => setCurrentTime(currentTime)),
    ];

    return () => {
      subscriptions.forEach((unsub) => unsub());
    };
  }, [wavesurfer]);

  return (
    <>
      <Row className="tools">
        Zoom:
        <Col span={12}>
          <Slider
            defaultValue={100}
            min={10}
            max={1000}
            step={10}
            tooltip={{ open: true, placement: 'top' }}
            onChange={onRangeChange}
          />
        </Col>
        <Col>
          <Checkbox checked={scrollbar} onChange={onScrollbarChange}>
            Scroll bar
          </Checkbox>
          <Checkbox checked={fillParent} onChange={onFillParentChange}>
            Fill parent
          </Checkbox>
          <Checkbox checked={autoCenter} onChange={onAutoCenterChange}>
            Auto center
          </Checkbox>
        </Col>
      </Row>
      <div ref={containerRef} style={{ minHeight: '120px' }} />
      <Divider />
      <Space wrap>
        <Button type="primary" onClick={onPlayClick}>
          {isPlaying ? t('recorderAudio.pause') : t('recorderAudio.play')}
        </Button>
        <Button type="primary" onClick={onDownloadClick}>
          {t('recorderAudio.download')}
        </Button>
      </Space>
      <p>Seconds played: {currentTime}</p>
    </>
  );
};

export default WaveSurferPlayer;
