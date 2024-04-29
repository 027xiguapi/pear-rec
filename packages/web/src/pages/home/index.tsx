import { ExclamationCircleFilled } from '@ant-design/icons';
import { Anchor, Modal, Card } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import EditGifCard from '../../components/card/editGifCard';
import RecordAudioCard from '../../components/card/recordAudioCard';
import RecordScreenCard from '../../components/card/recordScreenCard';
import RecordVideoCard from '../../components/card/recordVideoCard';
import ScanImageCard from '../../components/card/scanImageCard';
import SearchImageCard from '../../components/card/searchImageCard';
import CutScreenCard from '../../components/card/shotScreenCard';
import SpliceImageCard from '../../components/card/spliceImageCard';
import ViewAudioCard from '../../components/card/viewAudioCard';
import ViewImageCard from '../../components/card/viewImageCard';
import ViewVideoCard from '../../components/card/viewVideoCard';
import VideoConverterCard from '../../components/card/videoConverterCard';
import PinImageCard from '../../components/card/pinImageCard';
import EditImageCard from '../../components/card/editImageCard';
import RecordCanvasCard from '../../components/card/recordCanvasCard';
import HomeFooter from '../../components/home/HomeFooter';
import { db, defaultUser, defaultShortcut } from '../../db';
import ininitApp from '../../pages/main';
import styles from './index.module.scss';

const Home: React.FC = () => {
  const cscRef = useRef(null);
  const rscRef = useRef(null);
  const rvcRef = useRef(null);
  const racRef = useRef(null);
  const [user, setUser] = useState<any>({});

  useEffect(() => {
    if (user.id) {
      getShortcut(user.id);
    } else {
      getCurrentUser();
    }
  }, [user]);

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

  async function getShortcut(userId) {
    try {
      let shortcut = await db.shortcuts.where({ userId }).first();
      if (!shortcut) {
        shortcut = { userId, createdBy: userId, updatedBy: userId, ...defaultShortcut };
        await db.shortcuts.add(shortcut);
      }
      window.electronAPI?.sendSeSetShortcuts({
        screenshot: shortcut.screenshot,
        videoRecording: shortcut.videoRecording,
        screenRecording: shortcut.screenRecording,
        audioRecording: shortcut.audioRecording,
      });
    } catch (err) {
      console.log('getSetting', err);
    }
  }

  function getDevices() {
    return new Promise((resolve, reject) => {
      navigator.mediaDevices
        .enumerateDevices()
        .then((devices) => {
          let videoinputDevices: MediaDeviceInfo[] = [];
          let audioinputDevices: MediaDeviceInfo[] = [];
          let audiooutputDevices: MediaDeviceInfo[] = [];
          devices.forEach((device) => {
            // 没有授予硬件权限时，deviceId为空字符串
            if (device.deviceId == '') {
              return;
            }
            if (device.kind == 'videoinput') {
              videoinputDevices.push(device);
            } else if (device.kind == 'audioinput') {
              audioinputDevices.push(device);
            } else if (device.kind == 'audiooutput') {
              audiooutputDevices.push(device);
            } else {
              console.log('Some other kind of source/device: ', device);
            }
          });

          resolve({ flag: true, devices: devices });
        })
        .catch((err) => {
          reject({ flag: false, err });
        });
    });
  }

  function getCurrentAnchor(e) {
    return e || '#main';
  }

  const gridStyle: React.CSSProperties = {
    width: '25%',
    textAlign: 'center',
  };

  return (
    <div className={`${styles.home} ${window.isElectron ? styles.electron : styles.web}`}>
      <div className="container">
        <div className="wavesurfer1" />
        <div className="wavesurfer2" />
        <div className="nav">
          <Anchor
            className="anchor"
            direction="horizontal"
            getCurrentAnchor={getCurrentAnchor}
            items={[
              {
                key: 'main',
                href: '#main',
                title: '首页',
              },
              {
                key: 'image',
                href: '#image',
                title: '图片',
              },
              {
                key: 'video',
                href: '#video',
                title: '视频',
              },
            ]}
          />
        </div>
        <div className="content">
          <div id="main">
            <Card>
              <Card.Grid style={gridStyle}>
                <CutScreenCard ref={cscRef} />
              </Card.Grid>
              <Card.Grid style={gridStyle}>
                <RecordScreenCard ref={rscRef} />
              </Card.Grid>
              <Card.Grid style={gridStyle}>
                <RecordVideoCard ref={rvcRef} />
              </Card.Grid>
              <Card.Grid style={gridStyle}>
                <RecordAudioCard ref={racRef} />
              </Card.Grid>
              <Card.Grid style={gridStyle}>
                <EditGifCard />
              </Card.Grid>
              <Card.Grid style={gridStyle}>
                <ViewImageCard />
              </Card.Grid>
              <Card.Grid style={gridStyle}>
                <ViewVideoCard />
              </Card.Grid>
              <Card.Grid style={gridStyle}>
                <ViewAudioCard />
              </Card.Grid>
            </Card>
          </div>
          <div id="image">
            <Card>
              <Card.Grid style={gridStyle}>
                <EditGifCard />
              </Card.Grid>
              <Card.Grid style={gridStyle}>
                <ViewImageCard />
              </Card.Grid>
              <Card.Grid style={gridStyle}>
                <SearchImageCard user={user} />
              </Card.Grid>
              <Card.Grid style={gridStyle}>
                <ScanImageCard />
              </Card.Grid>
              <Card.Grid style={gridStyle}>
                <SpliceImageCard />
              </Card.Grid>
              <Card.Grid style={gridStyle}>
                <PinImageCard />
              </Card.Grid>
              <Card.Grid style={gridStyle}>
                <EditImageCard />
              </Card.Grid>
            </Card>
          </div>
          <div id="video">
            <Card>
              <Card.Grid style={gridStyle}>
                <RecordVideoCard />
              </Card.Grid>
              <Card.Grid style={gridStyle}>
                <RecordScreenCard />
              </Card.Grid>
              <Card.Grid style={gridStyle}>
                <VideoConverterCard />
              </Card.Grid>
              <Card.Grid style={gridStyle}>
                <RecordCanvasCard />
              </Card.Grid>
            </Card>
          </div>
        </div>
      </div>
      <HomeFooter />
    </div>
  );
};

ininitApp(Home);

export default Home;
