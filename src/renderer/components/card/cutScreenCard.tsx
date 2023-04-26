import React, {
  useEffect,
  useState,
  useImperativeHandle,
  forwardRef,
} from "react";
import { useNavigate } from "react-router-dom";
import { ScissorOutlined } from "@ant-design/icons";
import { Button, Card } from "antd";
import type { SizeType } from "antd/es/config-provider/SizeContext";
import { IpcEvents } from "@/ipcEvents";

const CutScreenCard = forwardRef((props: any, ref: any) => {
  const Navigate = useNavigate();
  useImperativeHandle(ref, () => ({}));
  const [size, setSize] = useState<SizeType>("large");
  const [isCutScreen, setIsCutScreen] = useState(true);

  function handleCutScreen() {
    // Navigate(`/shotScreen`);
    window.electronAPI.ipcRenderer.send(IpcEvents.EV_OPEN_SHOT_SCREEN_WIN, []);
  }

  return (
    <Card
      title="截屏"
      hoverable
      bordered={false}
      extra={"More"}
      style={{ maxWidth: 300 }}
    >
      <div className="cardContent">
        <Button
          type="link"
          disabled={!isCutScreen}
          icon={<ScissorOutlined />}
          size={size}
          onClick={handleCutScreen}
        />
      </div>
    </Card>
  );
});

export default CutScreenCard;
