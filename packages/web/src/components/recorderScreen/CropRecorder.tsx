import React, { useState, useRef } from "react";
import CropArea from "./CropArea";
import ScreenRecorder from "./ScreenRecorder";

const CropRecorder = (props) => {
	const [isRecording, setIsRecording] = useState(false); // 标记是否正在录制
	const [position, setPosition] = useState({ x: 200, y: 100 });
	const [size, setSize] = useState({ width: 500, height: 320 });

	function handleChangeIsRecording(isRecording: boolean) {
		setIsRecording(isRecording);
	}

	function handleChangePosition(position) {
		setPosition({
			x: position.x,
			y: position.y,
		});
	}

	function handleChangeSize(size) {
		setSize({
			width: size.width,
			height: size.height,
		});
	}

	return (
		<>
			<CropArea
				isRecording={isRecording}
				setPosition={handleChangePosition}
				setSize={handleChangeSize}
			/>
			<ScreenRecorder
				setIsRecording={handleChangeIsRecording}
				position={position}
				size={size}
			/>
		</>
	);
};

export default CropRecorder;
