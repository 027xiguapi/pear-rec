import React, { useEffect } from "react";
import { Link, Routes, Route } from "react-router-dom";
import {
  ScissorOutlined,
  VideoCameraOutlined,
  CameraOutlined,
  AudioOutlined,
  DownOutlined,
  EditOutlined,
  EllipsisOutlined,
} from "@ant-design/icons";

import { Card, Col, Row, Dropdown, Space } from "antd";
// import type { MenuProps } from "antd";
import "./index.scss";

// const items: MenuProps["items"] = [
//   {
//     label: (
//       <a
//         target="_blank"
//         rel="noopener noreferrer"
//         href="https://www.antgroup.com"
//       >
//         1st menu item
//       </a>
//     ),
//     key: "0",
//   },
//   {
//     label: (
//       <a
//         target="_blank"
//         rel="noopener noreferrer"
//         href="https://www.aliyun.com"
//       >
//         2nd menu item
//       </a>
//     ),
//     key: "1",
//   },
// ];

function handleCutScreen() {
  console.log(123);
}

function handleRecordScreen() {
  console.log(123);
}

function handleRecordVideo() {
  console.log(123);
}

function handleRecordAudio() {
  console.log(123);
}

const Home: React.FC = () => {
  useEffect(() => {
    window.electronAPI?.setTitle("梨子REC|pear REC");
  }, []);

  
  return (
    <Row className="home" gutter={16}>
      <Col span={6}>
        <Card
          title="截屏"
          hoverable
          bordered={false}
          extra={"More"}
          style={{ maxWidth: 300 }}
        >
          <div className="cardContent">
            <Link to="/cutScreen">
              <ScissorOutlined
                style={{ fontSize: "45px" }}
                onClick={handleCutScreen}
              />
            </Link>
            {/* <Dropdown menu={{ items }}>
            <Space>
              
              <DownOutlined />
            </Space>
          </Dropdown> */}
          </div>
        </Card>
      </Col>
      <Col span={6}>
        <Card
          title="录屏"
          hoverable
          bordered={false}
          extra={<a href="#">More</a>}
          style={{ maxWidth: 300 }}
        >
          <div className="cardContent">
            <Link to="/recordScreen">
              <CameraOutlined
                style={{ fontSize: "45px" }}
                onClick={handleRecordScreen}
              />
            </Link>
          </div>
        </Card>
      </Col>
      <Col span={6}>
        <Card
          title="录像"
          hoverable
          bordered={false}
          extra={<a href="#">More</a>}
          style={{ maxWidth: 300 }}
        >
          <div className="cardContent">
            <Link to="/recordVideo">
              <VideoCameraOutlined
                style={{ fontSize: "45px" }}
                onClick={handleRecordVideo}
              />
            </Link>
          </div>
        </Card>
      </Col>
      <Col span={6}>
        <Card
          title="录音"
          hoverable
          bordered={false}
          extra={<a href="#">More</a>}
          style={{ maxWidth: 300 }}
        >
          <div className="cardContent">
            <Link to="/recordAudio">
              <AudioOutlined
                style={{ fontSize: "45px" }}
                onClick={handleRecordAudio}
              />
            </Link>
          </div>
        </Card>
      </Col>
    </Row>
  );
};

export default Home;
