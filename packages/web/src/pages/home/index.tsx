import { ExclamationCircleFilled } from '@ant-design/icons';
import { Anchor, Col, Modal, Row } from 'antd';
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
    // getDevices();
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

  return (
    <div className={`${styles.home} ${window.isElectron ? styles.electron : styles.web}`}>
      <div className="container">
        <div className="wavesurfer"></div>
        <div className="nav">
          <Anchor
            direction="horizontal"
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
            <Row className="cardRow" justify="center" gutter={16}>
              <Col span={6}>
                <CutScreenCard ref={cscRef} />
              </Col>
              <Col span={6}>
                <RecordScreenCard ref={rscRef} />
              </Col>
              <Col span={6}>
                <RecordVideoCard ref={rvcRef} />
              </Col>
              <Col span={6}>
                <RecordAudioCard ref={racRef} />
              </Col>
            </Row>
            <Row className="cardRow" justify="center" gutter={16}>
              <Col span={6}>
                <EditGifCard />
              </Col>
              <Col span={6}>
                <ViewImageCard />
              </Col>
              <Col span={6}>
                <ViewVideoCard />
              </Col>
              <Col span={6}>
                <ViewAudioCard />
              </Col>
            </Row>
          </div>
          <div id="image">
            <Row className="cardRow" justify="center" gutter={16}>
              <Col span={6}>
                <EditGifCard />
              </Col>
              <Col span={6}>
                <ViewImageCard />
              </Col>
              <Col span={6}>
                <SearchImageCard user={user} />
              </Col>
              <Col span={6}>
                <ScanImageCard />
              </Col>
            </Row>
            <Row className="cardRow" justify="start" gutter={16}>
              <Col span={6}>
                <SpliceImageCard />
              </Col>
              <Col span={6}>
                <PinImageCard />
              </Col>
              <Col span={6}>
                <EditImageCard />
              </Col>
            </Row>
          </div>
          <div id="video">
            <Row className="cardRow" justify="start" gutter={16}>
              <Col span={6}>
                <RecordVideoCard />
              </Col>
              <Col span={6}>
                <RecordScreenCard />
              </Col>
              <Col span={6}>
                <VideoConverterCard />
              </Col>
              <Col span={6}>
                <RecordCanvasCard />
              </Col>
            </Row>
          </div>
        </div>
      </div>
      <HomeFooter></HomeFooter>
    </div>
  );
};

ininitApp(Home);

export default Home;
