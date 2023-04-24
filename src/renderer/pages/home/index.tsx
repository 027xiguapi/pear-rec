import React, { useEffect, useState, useRef } from "react";
import { Col, Row } from "antd";
import CutScreenCard from "renderer/components/card/cutScreenCard";
import RecordVideoCard from "renderer/components/card/recordVideoCard";
import RecordScreenCard from "renderer/components/card/recordScreenCard";
import RecordAudioCard from "renderer/components/card/recordAudioCard";
import "./index.scss";

const Home: React.FC = () => {
  const cscRef = useRef(null);
  const rscRef = useRef(null);
  const rvcRef = useRef(null);
  const racRef = useRef(null);

  const [videoinputDevices, setVideoinputDevices] = useState([]);// 视频输入 (摄像头)
  const [audioinputDevices, setAudioinputDevices] = useState([]);// 音频输入 (麦克风)
  const [audiooutputDevices, setAudiooutputDevices] = useState([]);// 音频输出 (扬声器)

  useEffect(() => {
    window.electronAPI?.setTitle("梨子REC|pear REC");
    getDevices();
  }, []);

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
            if (device.deviceId == "") {
              return;
            }
            if (device.kind == "videoinput") {
              videoinputDevices.push(device);
            } else if (device.kind == "audioinput") {
              audioinputDevices.push(device);
            } else if (device.kind == "audiooutput") {
              audiooutputDevices.push(device);
            } else {
              console.log("Some other kind of source/device: ", device);
            }
          });

          setVideoinputDevices(videoinputDevices);
          setAudioinputDevices(audioinputDevices);
          setAudiooutputDevices(audiooutputDevices);
          console.log("videoinputDevices", videoinputDevices);
          console.log("audioinputDevices", audioinputDevices);
          console.log("audiooutputDevices", audiooutputDevices);
          rvcRef.current.setIsRecordVideo(
            videoinputDevices.length ? true : false
          );
          racRef.current.setIsRecordAudio(
            audioinputDevices.length ? true : false
          );
          resolve({ flag: true, devices: devices });
        })
        .catch((err) => {
          reject({ flag: false, err });
        });
    });
  }

  return (
    <Row className="home" gutter={16}>
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
  );
};

export default Home;
