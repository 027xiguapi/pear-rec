import React, { useEffect, useState, useRef } from 'react';
import { Col, Row } from 'antd';
import HomeFooter from '../../components/home/HomeFooter';
import CutScreenCard from '../../components/card/shotScreenCard';
import RecordVideoCard from '../../components/card/recordVideoCard';
import RecordScreenCard from '../../components/card/recordScreenCard';
import RecordAudioCard from '../../components/card/recordAudioCard';
import ViewImageCard from '../../components/card/viewImageCard';
import ViewVideoCard from '../../components/card/viewVideoCard';
import ViewAudioCard from '../../components/card/viewAudioCard';
import EditGifCard from '../../components/card/editGifCard';
import ininitApp from '../../pages/main';
import { useUserApi } from '../../api/user';
import styles from './index.module.scss';

const Home: React.FC = () => {
  const userApi = useUserApi();
  const cscRef = useRef(null);
  const rscRef = useRef(null);
  const rvcRef = useRef(null);
  const racRef = useRef(null);
  const [user, setUser] = useState({} as any);
  const [videoinputDevices, setVideoinputDevices] = useState([]); // 视频输入 (摄像头)
  const [audioinputDevices, setAudioinputDevices] = useState([]); // 音频输入 (麦克风)
  const [audiooutputDevices, setAudiooutputDevices] = useState([]); // 音频输出 (扬声器)

  useEffect(() => {
    document.addEventListener('keydown', handleKeydown);
    getDevices();
    window.isOffline || user.id || getCurrentUser();
  }, []);

  function handleKeydown(event: any) {
    // if ((event.metaKey || event.altKey) && event.code === "KeyQ") {
    // 	cscRef.current!.handleShotScreen();
    // }
  }

  async function getCurrentUser() {
    try {
      const res = (await userApi.getCurrentUser()) as any;
      if (res.code == 0) {
        setUser(res.data);
      }
    } catch (err) {
      console.log(err);
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
            <ViewImageCard />
          </Col>
          <Col span={6}>
            <ViewVideoCard />
          </Col>
          <Col span={6}>
            <ViewAudioCard />
          </Col>
          <Col span={6}>
            <EditGifCard />
          </Col>
        </Row>
      </div>
      <HomeFooter></HomeFooter>
    </div>
  );
};

ininitApp(Home);

export default Home;
