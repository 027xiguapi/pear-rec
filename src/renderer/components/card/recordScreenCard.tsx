import React, {
  useEffect,
  useState,
  useImperativeHandle,
  forwardRef,
} from "react";
import { useNavigate } from "react-router-dom";
import { CameraOutlined } from "@ant-design/icons";
import { Button, Card } from "antd";
import type { SizeType } from "antd/es/config-provider/SizeContext";

const RecordScreenCard = forwardRef((props: any, ref: any) => {
  const Navigate = useNavigate();
  useImperativeHandle(ref, () => ({}));
  const [size, setSize] = useState<SizeType>("large");
  const [isRecordScreen, setIsRecordScreen] = useState(true);

  function handleCutScreen() {
    Navigate(`/recordScreen`);
  }

  return (
    <Card
      title="录屏"
      hoverable
      bordered={false}
      extra={<a href="#">More</a>}
      style={{ maxWidth: 300 }}
    >
      <div className="cardContent">
        <Button
          type="link"
          disabled={!isRecordScreen}
          icon={<CameraOutlined />}
          size={size}
          onClick={handleCutScreen}
        />
      </div>
    </Card>
  );
});

export default RecordScreenCard;
