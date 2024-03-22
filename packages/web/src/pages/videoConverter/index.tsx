import { InboxOutlined, CloseOutlined } from '@ant-design/icons';
import { Space, Card, Upload, Button } from 'antd';
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

  function handleSave(imgUrl) {
    saveAs(imgUrl, `pear-rec_${+new Date()}.gif`);
  }

  function handleDeleteVideo(video) {
    let newVideos = videos.filter((_video) => {
      return _video.uid !== video.uid;
    });
    setVideos(newVideos);
  }

  const props: UploadProps = {
    name: 'file',
    multiple: true,
    accept: 'video/*',
    showUploadList: false,
    beforeUpload: (file) => {
      setVideos([...videos, file]);
      return false;
    },
    onDrop(e) {
      console.log('Dropped files', e.dataTransfer.files);
    },
  };

  return (
    <div className={styles.videoConverter}>
      <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
        <Upload.Dragger {...props}>
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">点击或拖拽上传视频</p>
          <p className="ant-upload-hint">支持单次或批量上传。</p>
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
      </Space>
    </div>
  );
};

ininitApp(App);
