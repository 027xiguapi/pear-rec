import type { SliderSingleProps, UploadFile } from 'antd';
import { Button, Card, Col, InputNumber, Layout, Row, Slider, Space, Switch } from 'antd';
import Konva from 'konva';
import { useEffect, useRef, useState } from 'react';
import { Layer, Stage } from 'react-konva';
import { ImgListContext } from './imgListContext';
import styles from './spliceImg.module.scss';
import UploadImg from './upload';

const { Sider, Content } = Layout;

const marks: SliderSingleProps['marks'] = {
  0: '0%',
  100: '100%',
  200: '200%',
};

const SpliceImg = (porps) => {
  const stageRef = useRef(null);
  const layerRef = useRef(null);
  const imgListRef = useRef([]);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [move, setMove] = useState<any>('35');
  const [isVertical, setIsVertical] = useState(true);
  const [isSort, setIsSort] = useState(true);
  const [scale, setScale] = useState(100);
  const [stageWidth, setStageWidth] = useState<any>(window.innerWidth - 400);
  const [stageHeight, setStageHeight] = useState<any>(window.innerHeight - 180);

  useEffect(() => {
    init();
  }, [porps.fileList]);

  useEffect(() => {
    renderImg();
  }, [fileList]);

  useEffect(() => {
    move > 0 &&
      imgListRef.current.length &&
      (() => {
        setPosition();
        setStageSize();
      })();
  }, [move]);

  useEffect(() => {
    imgListRef.current.length &&
      (() => {
        setZIndex();
        setStageSize();
      })();
  }, [isSort]);

  useEffect(() => {
    imgListRef.current.length &&
      (() => {
        setPosition();
        setStageSize();
      })();
  }, [isVertical]);

  function renderImg() {
    layerRef.current.removeChildren();
    if (fileList.length) {
      let layer = new Konva.Layer();
      let group = new Konva.Group();
      let imgList = [];
      layer.add(group);
      fileList.map((img, index) => {
        Konva.Image.fromURL(
          img.thumbUrl || URL.createObjectURL(img.originFileObj),
          function (image) {
            group.add(image);
            imgList.push({ image: image, index: index });
            if (index >= fileList.length - 1) {
              imgListRef.current = imgList;
              setPosition();
              setZIndex();
              setStageSize();
              layerRef.current.add(group);
              layerRef.current.draw();
            }
          },
        );
      });
    } else {
      setStageWidth(window.innerWidth - 400);
      setStageHeight(window.innerHeight - 180);
    }
  }

  function setPosition() {
    imgListRef.current.map((children) => {
      let { image, index } = children;
      if (isVertical) {
        image.setAbsolutePosition({ x: 0, y: 0 + index * move });
      } else {
        image.setAbsolutePosition({ x: 0 + index * move, y: 0 });
      }
    });
  }

  function setZIndex() {
    imgListRef.current.map((children) => {
      let { image, index } = children;
      if (isSort) {
        image.zIndex(imgListRef.current.length - index - 1);
      } else {
        image.zIndex(index);
      }
    });
  }

  function setStageSize() {
    let imgHeightList = [];
    let imgWidthList = [];
    imgListRef.current.map((children) => {
      let { image, index } = children;
      let imgWidth = image.getAttr('image').width;
      let imgHeight = image.getAttr('image').height;
      imgHeightList.push(isVertical ? imgHeight + index * move : imgWidth);
      imgWidthList.push(isVertical ? imgWidth : imgWidth + index * move);
    });

    let _stageHeight = imgHeightList.length
      ? Math.max.apply(null, imgHeightList)
      : window.innerHeight;

    let _stageWidth = imgWidthList.length ? Math.max.apply(null, imgWidthList) : window.innerWidth;
    setStageHeight(_stageHeight);
    setStageWidth(_stageWidth);
  }

  function handleExport() {
    const url = stageRef.current.toDataURL({ pixelRatio: 2 });
    porps.onSave(url);
  }

  function init() {
    setFileList(porps.fileList || []);
    setIsVertical(porps.isVertical);
    setMove(35);
    setStageWidth(window.innerWidth);
    setStageHeight(window.innerHeight);
    setScale(100);
    layerRef.current.removeChildren();
  }

  function handleReset() {
    init();
  }

  return (
    <ImgListContext.Provider
      value={{
        fileList,
        setFileList,
      }}
    >
      <Layout className={styles.spliceImg}>
        <Sider width={315} className="sider">
          <UploadImg />
        </Sider>
        <Layout>
          <Content className="content">
            <Card className="tool">
              <Row className="toolRow">
                <Space>
                  方向
                  <Switch
                    checkedChildren="垂直"
                    unCheckedChildren="水平"
                    value={isVertical}
                    onChange={setIsVertical}
                  />
                  排序
                  <Switch
                    checkedChildren="正序"
                    unCheckedChildren="倒叙"
                    defaultChecked
                    onChange={setIsSort}
                  />
                  间距
                  <InputNumber min={1} value={move} onChange={setMove} />
                  尺寸
                  <InputNumber prefix="宽" value={stageWidth} onChange={setStageWidth} disabled />*
                  <InputNumber prefix="高" value={stageHeight} onChange={setStageHeight} disabled />
                  <Button onClick={handleReset}>重置</Button>
                  <Button type="primary" onClick={handleExport}>
                    保存
                  </Button>
                </Space>
              </Row>
              <Row className="toolRow">
                <Col span={3}>
                  <span className="toolLabel">显示比: {scale}%</span>
                </Col>
                <Col span={6}>
                  <Slider min={1} max={200} marks={marks} defaultValue={100} onChange={setScale} />
                </Col>
              </Row>
            </Card>
            <Card className="canvas">
              <Stage
                width={stageWidth}
                height={stageHeight}
                ref={stageRef}
                style={{ transform: 'scale(' + scale / 100 + ')', transformOrigin: 'left top' }}
              >
                <Layer ref={layerRef}></Layer>
              </Stage>
            </Card>
          </Content>
        </Layout>
      </Layout>
    </ImgListContext.Provider>
  );
};

export default SpliceImg;
