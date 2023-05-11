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
import { ipcRenderer } from "electron";

const ShotScreenCard = forwardRef((props: any, ref: any) => {
	const Navigate = useNavigate();
	useImperativeHandle(ref, () => ({
		handleCutScreen,
	}));
	const [size, setSize] = useState<SizeType>("large");
	const [isCutScreen, setIsCutScreen] = useState(true);

	function handleCutScreen() {
		ipcRenderer.send("ss:open-win");
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

export default ShotScreenCard;
