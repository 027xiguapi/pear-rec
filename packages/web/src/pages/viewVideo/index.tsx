import { ExclamationCircleFilled, LeftOutlined } from '@ant-design/icons';
import { Button, Drawer, Empty, Modal } from 'antd';
import Plyr from 'plyr';
import 'plyr/dist/plyr.css';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { db, defaultUser } from '../../db';
import ininitApp from '../../pages/main';
import { Local } from '../../util/storage';
import styles from './index.module.scss';

const ViewVideo = () => {
  const { t } = useTranslation();
  let refPlayer = useRef<Plyr>();
  const inputRef = useRef(null);
  const [user, setUser] = useState(Local.get('user') || ({} as any));
  const [source, setSource] = useState('');
  const [videos, setVideos] = useState([]);
  const [videoIndex, setVideoIndex] = useState(0);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (source) {
      const player = new Plyr('#player');
      refPlayer.current = player;
    } else {
      handleDrop();
      user.id || getCurrentUser();
      initVideo();
    }
  }, [source]);

  async function getCurrentUser() {
    try {
      let user = await db.users.where({ userType: 1 }).first();
      if (!user) {
        user = defaultUser;
        await db.users.add(user);
      }
      setUser(user);
      Local.set('user', user);
    } catch (err) {
      console.log('getCurrentUser', err);
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

  async function initVideo() {
    const paramsString = location.search;
    const searchParams = new URLSearchParams(paramsString);
    const videoUrl = searchParams.get('videoUrl');
    const recordId = searchParams.get('recordId');

    if (videoUrl) {
      if (videoUrl.substring(0, 4) == 'blob' || videoUrl.substring(0, 7) == 'pearrec') {
        setSource(videoUrl);
      } else {
        if (window.isElectron) {
          let { videos, currentIndex } = await window.electronAPI.invokeVvGetVideos(videoUrl);
          let _videos = [...videos];
          setVideos(_videos);
          setVideoIndex(currentIndex);
          setSource(_videos[currentIndex].url);
        } else {
          setSource(`pearrec://${videoUrl}`);
        }
      }
    } else if (recordId) {
      let record = await db.records.where({ id: Number(recordId) }).first();
      setSource(
        window.isElectron ? `pearrec://${record.filePath}` : URL.createObjectURL(record.fileData),
      );
    }
  }

  function setVideo(index: number) {
    setSource(videos[index].url);
    setVideoIndex(index);
  }

  function handleDrop() {
    document.addEventListener('drop', (e) => {
      e.preventDefault();
      e.stopPropagation();

      const files = e.dataTransfer!.files;
      refPlayer.current!.source = {
        type: 'video',
        sources: [
          {
            src: window.URL.createObjectURL(files[0]),
            type: 'video/mp4',
          },
        ],
      };
    });
    document.addEventListener('dragover', (e) => {
      e.preventDefault();
      e.stopPropagation();
    });
  }

  function getVideoUpload() {
    inputRef.current.click();
  }

  function handleVideoUpload(event) {
    const file = event.target.files[0];
    setSource(window.URL.createObjectURL(file));
  }

  function showDrawer() {
    setOpen(true);
  }

  function closeDrawer() {
    setOpen(false);
  }

  return (
    <div className={styles.viewVideo}>
      {source ? (
        <video id="player" playsInline controls src={source} />
      ) : (
        <Empty
          image="./imgs/svg/empty.svg"
          imageStyle={{ height: 60 }}
          description={<span>{t('viewVideo.emptyDescription')}</span>}
        >
          <Button type="primary" onClick={getVideoUpload}>
            {t('viewVideo.emptyBtn')}
          </Button>
          <input
            type="file"
            accept="video/*"
            className="inputRef"
            ref={inputRef}
            onChange={handleVideoUpload}
          />
        </Empty>
      )}
      <div className={`sidebar ${open ? 'open' : 'close'}`}>
        <LeftOutlined onClick={showDrawer} />
      </div>
      <Drawer
        title="视频列表"
        placement="right"
        onClose={closeDrawer}
        open={open}
        className="videoList"
        getContainer={false}
        mask={false}
      >
        {videos.map((video, index) => (
          <p
            className={`videoName ${index == videoIndex ? 'current' : ''}`}
            key={index}
            onDoubleClick={() => setVideo(index)}
            title={video.name}
          >
            {video.name}
          </p>
        ))}
      </Drawer>
    </div>
  );
};

ininitApp(ViewVideo);
export default ViewVideo;
