import { InboxOutlined, CloseOutlined, DownloadOutlined } from '@ant-design/icons';
import { Space, Card, Upload, Button, Image } from 'antd';
import { saveAs } from 'file-saver';
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import VideoToGif from '../../components/videoToGif';
import ininitApp from '../main';
import type { UploadProps } from 'antd';
import styles from './index.module.scss';

const App: React.FC = () => {
  const { t } = useTranslation();
  const [videos, setVideos] = useState([]);
  const [inputs, setInputs] = useState([]);

  function handleSave(input) {
    setInputs([input, ...inputs]);
  }

  function onDownload(input) {
    saveAs(input.src, input.name);
  }

  function handleDeleteVideo(video) {
    let newVideos = videos.filter((_video) => {
      return _video.uid !== video.uid;
    });
    setVideos(newVideos);
  }

  function handleDeleteInput(input) {
    let newInputs = inputs.filter((_input) => {
      return _input.name !== input.name;
    });
    setInputs(newInputs);
  }

  const props: UploadProps = {
    name: 'file',
    multiple: false,
    accept: 'video/*',
    showUploadList: false,
    beforeUpload: (file) => {
      setVideos([file]);
      // setVideos((preValue) => {
      //   return [file, ...preValue];
      // });
      return false;
    },
    onDrop(e) {
      console.log('Dropped files', e.dataTransfer.files);
    },
  };

  return (
    <div className={styles.videoConverter}>
      <Space direction="vertical" size="middle" className="content" style={{ display: 'flex' }}>
        <Upload.Dragger {...props}>
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">点击或拖拽上传视频</p>
          <p className="ant-upload-hint">支持单次上传一个文件。</p>
        </Upload.Dragger>
        {videos.map((video, index) => (
          <Card
            title={`${video.name}`}
            key={index}
            extra={
              <Button
                type="text"
                onClick={() => {
                  handleDeleteVideo(video);
                }}
              >
                <CloseOutlined />
              </Button>
            }
          >
            <VideoToGif video={video} onSave={handleSave} />
          </Card>
        ))}
        {inputs.map((input, index) => (
          <Card
            title={`${input.name}`}
            key={index}
            extra={
              <Space>
                <Button type="text" onClick={() => onDownload(input)}>
                  <DownloadOutlined />
                </Button>
                <Button
                  type="text"
                  onClick={() => {
                    handleDeleteInput(input);
                  }}
                >
                  <CloseOutlined />
                </Button>
              </Space>
            }
          >
            <Space>
              <Image width={200} src={input.src} />
              <div>
                <div>时长:{input.duration}s</div>
                <div>大小:{input.size}MB</div>
                <div>
                  尺寸:{input.width} x {input.heighe}
                </div>
              </div>
            </Space>
          </Card>
        ))}
      </Space>
    </div>
  );
};

ininitApp(App);
