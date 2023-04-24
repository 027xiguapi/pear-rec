import React, { useState, useRef, useEffect } from "react";
import { Stage, Layer } from "react-konva";
import { Button } from "antd";
import CutRect from "../../components/cutScreen/CutRect";
import { useAppSelector, useAppDispatch } from "../../../stores/hooks";
import {
  increment,
  decrement,
  selectCount,
} from "../../../stores/reducer/counter";
import { updateUser, selectUser } from "../../../stores/reducer/user";
import "./index.scss";


const CutScreen = () => {
  const stageRef = useRef(null);
  const crRef = useRef(null);
  // const [bg, setBg] = useState("/main_window/assets/imgs/1.jpg");
  const [bg, setBg] = useState("");
  // const [isSelected, setIsSelected] = useState(false);

  // function handleClick(e: any) {
  //   if (e.target.nodeType == "Shape") {
  //     setIsSelected(true);
  //   } else {
  //     setIsSelected(false);
  //   }
  // }

  
  useEffect(()=>{
    window.electronAPI?.setTitle("截图|梨子REC");
  }, [])

  // 根据区域生成图片
  function getCutImage(info: any) {
    const { x, y, width, height } = info;
    const img = new Image();
    img.src = bg;
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = width;
    canvas.height = height;
    ctx.drawImage(img, -x, -y, window.innerWidth, window.innerHeight);
    return canvas.toDataURL("image/png");
  }

  // 确认截图方法
  async function handleCut() {
    const { width, height, x, y, scaleX = 1, scaleY = 1 } = crRef.current.rectInfo;
    const _x = width > 0 ? x : x + width * scaleX;
    const _y = height > 0 ? y : y + height * scaleY;
    const pic = getCutImage({
      x: _x,
      y: _y,
      width: Math.abs(width) * scaleX,
      height: Math.abs(height) * scaleY,
    });
    console.log('pic', pic);

    // 目的是发给主窗体页面让其接收到这个图片
    window.electronAPI?.setCutScreen(pic);
  }

  async function handleCutScreen() {
    await window.electronAPI?.getCutScreen(setBg);
    handleCut();
  }

  const dispatch = useAppDispatch();
  console.log("dispatch", dispatch);
  const counter = useAppSelector(selectCount);
  console.log("页面---counter:", counter);
  const user = useAppSelector(selectUser);
  console.log("页面---user:", user);
  

  return (
    <div className="container" style={{ backgroundImage: "url('" + bg + "')" }}>
      <Stage
        ref={stageRef}
        width={window.innerWidth}
        height={window.innerHeight}
        // onClick={handleClick}
      >
        <Layer>
          <CutRect ref={crRef} stageRef={stageRef} handleCutScreen={handleCutScreen} />
        </Layer>
      </Stage>
      <Button type="primary" className="screenbtn" onClick={handleCutScreen}>
        图片
      </Button>
    </div>
  );
};

export default CutScreen;
