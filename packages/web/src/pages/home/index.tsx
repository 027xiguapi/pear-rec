import { ExclamationCircleFilled } from '@ant-design/icons';
import { Col, Modal, Row } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import EditGifCard from '../../components/card/editGifCard';
import RecordAudioCard from '../../components/card/recordAudioCard';
import RecordScreenCard from '../../components/card/recordScreenCard';
import RecordVideoCard from '../../components/card/recordVideoCard';
import CutScreenCard from '../../components/card/shotScreenCard';
import ViewAudioCard from '../../components/card/viewAudioCard';
import ViewImageCard from '../../components/card/viewImageCard';
import ViewVideoCard from '../../components/card/viewVideoCard';
import HomeFooter from '../../components/home/HomeFooter';
import { db, defaultUser } from '../../db';
import ininitApp from '../../pages/main';
import styles from './index.module.scss';

const Home: React.FC = () => {
  const cscRef = useRef(null);
  const rscRef = useRef(null);
  const rvcRef = useRef(null);
  const racRef = useRef(null);
  const [user, setUser] = useState<any>({});

  useEffect(() => {
    document.addEventListener('keydown', handleKeydown);
    getDevices();
    user.id || getCurrentUser();
  }, []);

  function handleKeydown(event: any) {
    // if ((event.metaKey || event.altKey) && event.code === "KeyQ") {
    // 	cscRef.current!.handleShotScreen();
    // }
  }

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
      <HomeFooter></HomeFooter>
    </div>
  );
};

ininitApp(Home);

export default Home;
