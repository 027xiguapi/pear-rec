import React, {
	useState,
	useEffect,
	useRef,
	useImperativeHandle,
	forwardRef,
} from "react";
import { Group, Text, Rect, Transformer } from "react-konva";

const width = window.innerWidth;
const height = window.innerHeight;

const CutRect = forwardRef((props: any, ref: any) => {
	const { stageRef, handleCutScreen } = props;
	const rectRef = useRef(null);
	const trRef = useRef(null);
	const [rectInfo, setRectInfo] = useState({
		x: 0,
		y: 0,
		width: width,
		height: height,
	});
	const [toolInfo, setToolInfo] = useState({
		x: 0,
		y: 0,
		width: 200,
		height: 40,
	});
	useEffect(() => {
		trRef.current.nodes([rectRef.current]);
		trRef.current.getLayer().batchDraw();
	}, []);

	useEffect(() => {
		handleToolInfo();
	}, [rectInfo]);

	useImperativeHandle(ref, () => ({
		rectInfo,
	}));

	function handleRectMouseenter() {
		stageRef.current.container().style.cursor = "move";
	}

	function handleRectMouseleave() {
		stageRef.current.container().style.cursor = "default";
	}

	function handleRectDragEnd() {
		setRectInfo({ ...rectRef.current.attrs });
	}

	function handleTrChange(newTr: any) {
		setRectInfo({ ...newTr });
	}

	function handleCancel() {
		window.electronAPI?.closeCutScreen();
	}

	function handleSubmit() {
		handleCutScreen();
	}

	function handleToolInfo() {
		const { width, height } = toolInfo;
		const x = getToolX();
		const y = getToolY();
		setToolInfo({ x, y, width, height });
	}

	function getToolX() {
		return (
			rectInfo.x +
			rectInfo.width +
			(rectInfo.x + rectInfo.width + 205 < width ? -205 : -205)
		);
	}

	function getToolY() {
		return (
			rectInfo.y +
			rectInfo.height +
			(rectInfo.y + rectInfo.height + 45 < height ? 5 : -45)
		);
	}

	return (
		<>
			<Rect
				ref={rectRef}
				x={rectInfo.x}
				y={rectInfo.y}
				width={rectInfo.width}
				height={rectInfo.height}
				fill={"rgba(255,0,0, 0.25)"}
				draggable
				onMouseenter={handleRectMouseenter}
				onMouseleave={handleRectMouseleave}
				onDragEnd={handleRectDragEnd}
				// onTransformEnd={handleRectTransformEnd}
			/>
			<Transformer
				ref={trRef}
				rotateEnabled={false}
				borderDash={[3, 3]}
				// onTransformEnd={handleTrTransformEnd}
				boundBoxFunc={(oldBox, newBox) => {
					handleTrChange(newBox);
					return newBox;
				}}
			/>
			<Group>
				<Rect
					x={toolInfo.x}
					y={toolInfo.y}
					width={toolInfo.width}
					height={toolInfo.height}
					fill={"white"}
					stroke={"#555"}
					strokeWidth={1}
				/>
				<Text
					x={toolInfo.x}
					y={toolInfo.y}
					width={toolInfo.width / 2}
					height={toolInfo.height}
					align={"center"}
					verticalAlign={"middle"}
					fontSize={18}
					text="取消"
					fill="red"
					onClick={handleCancel}
				/>
				<Text
					x={toolInfo.x + 100}
					y={toolInfo.y}
					width={toolInfo.width / 2}
					height={toolInfo.height}
					align={"center"}
					verticalAlign={"middle"}
					fontSize={18}
					text="确定"
					fill="green"
					onClick={handleSubmit}
				/>
			</Group>
		</>
	);
});

export default CutRect;
