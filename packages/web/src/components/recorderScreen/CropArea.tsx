import React, { useState } from "react";
import { Resizable } from "re-resizable";
// import ScreenRecorder from "./ScreenRecorder";

const CropArea = (props) => {
	const [isDragging, setIsDragging] = useState(false);
	const [position, setPosition] = useState({ x: 200, y: 100 });
	const [offset, setOffset] = useState({ x: 200, y: 100 });

	function handleMouseDownCropArea(event) {
		if (!props.isRecording) {
			event.preventDefault();
			setIsDragging(true);
			setOffset({
				x: event.clientX - position.x,
				y: event.clientY - position.y,
			});
		}
	}

	function handleMouseMoveCropArea(event) {
		if (isDragging && !props.isRecording) {
			let x = event.clientX - offset.x;
			let y = event.clientY - offset.y;
			setPosition({
				x: x,
				y: y,
			});
			props.setPosition({ x, y });
		}
	}

	function handleMouseUpCropArea() {
		setIsDragging(false);
	}

	function handleResizeCropArea(event, direction, elementRef) {
		let width = elementRef.clientWidth;
		let height = elementRef.clientHeight;
		props.setSize({ width, height });
	}

	return (
		<div
			style={{
				top: position.y,
				left: position.x,
				pointerEvents: props.isRecording ? "none" : "auto",
			}}
			className="cropArea"
		>
			<Resizable
				defaultSize={{
					width: 500,
					height: 320,
				}}
				enable={{
					top: false,
					right: props.isRecording ? false : true,
					bottom: props.isRecording ? false : true,
					left: false,
					topRight: false,
					bottomRight: props.isRecording ? false : true,
					bottomLeft: false,
					topLeft: false,
				}}
				onResize={handleResizeCropArea}
			>
				<div className="contentCropArea">
					<div
						className="innerCropArea"
						id="innerCropArea"
						onMouseDown={handleMouseDownCropArea}
						onMouseMove={handleMouseMoveCropArea}
						onMouseUp={handleMouseUpCropArea}
					></div>
				</div>
			</Resizable>
		</div>
	);
};

export default CropArea;
