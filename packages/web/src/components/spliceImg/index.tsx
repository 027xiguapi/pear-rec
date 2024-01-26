import type { UploadFile } from 'antd';
import { Button, Card, InputNumber, Layout, Space, Switch } from 'antd';
import Konva from 'konva';
import { useEffect, useRef, useState } from 'react';
import { Layer, Stage } from 'react-konva';
import ImgList from './imgList';
import { ImgListContext } from './imgListContext';
import styles from './spliceImg.module.scss';

const { Sider, Content } = Layout;

const SpliceImg = (porps) => {
  const stageRef = useRef(null);
  const layerRef = useRef(null);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [move, setMove] = useState<any>('35');
  const [stageWidth, setStageWidth] = useState<any>(window.innerWidth - 400);
  const [stageHeight, setStageHeight] = useState<any>(window.innerHeight - 180);
  const [imgList, setImgList] = useState([]);
  const [isVertical, setIsVertical] = useState(true);
  const [isSort, setIsSort] = useState(true);

  useEffect(() => {
    if (fileList.length) {
      let imgHeightList = [];
      let imgWidthList = [];
      fileList.map((img, index) => {
        Konva.Image.fromURL(URL.createObjectURL(img.originFileObj), function (image) {
          let imgWidth = image.getAttr('image').width;
          let imgHeight = image.getAttr('image').height;
          // let height = isVertical ? (stageWidth * imgHeight) / imgWidth : stageHeight;
          // let width = isVertical ? stageWidth : (stageHeight * imgWidth) / imgHeight;
          // image.setSize({ width: imgWidth, height: imgHeight });
          if (isVertical) {
            image.setAbsolutePosition({ x: 0, y: 0 + index * move });
          } else {
            image.setAbsolutePosition({ x: 0 + index * move, y: 0 });
          }
          layerRef.current.add(image);
          layerRef.current.draw();
          imgHeightList.push(imgHeight + index * move);
          imgWidthList.push(imgWidth + index * move);
          if (index >= fileList.length - 1) {
            let _stageHeight = imgHeightList.length
              ? Math.max.apply(null, imgHeightList)
              : window.innerHeight;

            let _stageWidth = imgWidthList.length
              ? Math.max.apply(null, imgWidthList)
              : window.innerWidth;

            setStageHeight(_stageHeight);
            setStageWidth(_stageWidth);
          }
        });
      });
    } else {
      setStageWidth(window.innerWidth - 400);
      setStageHeight(window.innerHeight - 180);
      layerRef.current.removeChildren();
    }
  }, [fileList]);

  function handleExport() {
    const url = stageRef.current.toDataURL();
    porps.onSave(url);
  }

  function handleReset() {
    setFileList([]);
    setMove(35);
    setStageWidth(window.innerWidth);
    setStageHeight(window.innerHeight);
    layerRef.current.removeChildren();
  }

  return (
    <ImgListContext.Provider
      value={{
        fileList,
        setFileList,
        imgList,
        setImgList,
      }}
    >
      <Layout className={styles.spliceImg}>
        <Sider width={315} className="sider">
          <ImgList />
        </Sider>
        <Layout>
          <Content className="content">
            <Card className="tool">
              <Space>
                方向
                <Switch
                  checkedChildren="垂直"
                  unCheckedChildren="水平"
                  defaultChecked
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
                <InputNumber prefix="宽" value={stageWidth} onChange={setStageWidth} />*
                <InputNumber prefix="高" value={stageHeight} onChange={setStageHeight} />
                <Button onClick={handleReset}>重置</Button>
                <Button type="primary" onClick={handleExport}>
                  保存
                </Button>
              </Space>
            </Card>
            <Card className="canvas">
              <Stage width={stageWidth} height={stageHeight} ref={stageRef}>
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
