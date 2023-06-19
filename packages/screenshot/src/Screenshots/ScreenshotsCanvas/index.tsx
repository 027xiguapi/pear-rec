import React, {
	forwardRef,
	memo,
	ReactElement,
	useCallback,
	useEffect,
	useImperativeHandle,
	useLayoutEffect,
	useRef,
} from "react";
import useBounds from "../hooks/useBounds";
import useCursor from "../hooks/useCursor";
import useEmiter from "../hooks/useEmiter";
import useHistory from "../hooks/useHistory";
import useOperation from "../hooks/useOperation";
import useStore from "../hooks/useStore";
import { Bounds, HistoryItemType, Point } from "../types";
import getBoundsByPoints from "./getBoundsByPoints";
import getPoints from "./getPoints";
import "./index.scss";
import isPointInDraw from "./isPointInDraw";

const borders = ["top", "right", "bottom", "left"];

export enum ResizePoints {
	ResizeTop = "top",
	ResizetopRight = "top-right",
	ResizeRight = "right",
	ResizeRightBottom = "right-bottom",
	ResizeBottom = "bottom",
	ResizeBottomLeft = "bottom-left",
	ResizeLeft = "left",
	ResizeLeftTop = "left-top",
	Move = "move",
}

const resizePoints = [
	ResizePoints.ResizeTop,
	ResizePoints.ResizetopRight,
	ResizePoints.ResizeRight,
	ResizePoints.ResizeRightBottom,
	ResizePoints.ResizeBottom,
	ResizePoints.ResizeBottomLeft,
	ResizePoints.ResizeLeft,
	ResizePoints.ResizeLeftTop,
];

export default memo(
	forwardRef<CanvasRenderingContext2D>(function ScreenshotsCanvas(
		props,
		ref,
	): ReactElement | null {
		const { url, image, width, height } = useStore();

		const emiter = useEmiter();
		const [history] = useHistory();
		const [cursor] = useCursor();
		const [bounds, boundsDispatcher] = useBounds();
		const [operation] = useOperation();

		const resizeOrMoveRef = useRef<string>();
		const pointRef = useRef<Point | null>(null);
		const boundsRef = useRef<Bounds | null>(null);
		const canvasRef = useRef<HTMLCanvasElement | null>(null);
		const ctxRef = useRef<CanvasRenderingContext2D | null>(null);

		const isCanResize = bounds && !history.stack.length && !operation;

		const draw = useCallback(() => {
			if (!bounds || !ctxRef.current) {
				return;
			}

			const ctx = ctxRef.current;
			ctx.imageSmoothingEnabled = true;
			// 设置太高，图片会模糊
			ctx.imageSmoothingQuality = "low";
			ctx.clearRect(0, 0, bounds.width, bounds.height);

			history.stack.slice(0, history.index + 1).forEach((item) => {
				if (item.type === HistoryItemType.Source) {
					item.draw(ctx, item);
				}
			});
		}, [bounds, ctxRef, history]);

		const onMouseDown = useCallback(
			(e: React.MouseEvent, resizeOrMove: string) => {
				if (e.button !== 0 || !bounds) {
					return;
				}
				if (!operation) {
					resizeOrMoveRef.current = resizeOrMove;
					pointRef.current = {
						x: e.clientX,
						y: e.clientY,
					};
					boundsRef.current = {
						x: bounds.x,
						y: bounds.y,
						width: bounds.width,
						height: bounds.height,
					};
				} else {
					const draw = isPointInDraw(
						bounds,
						canvasRef.current,
						history,
						e.nativeEvent,
					);
					if (draw) {
						emiter.emit("drawselect", draw, e.nativeEvent);
					} else {
						emiter.emit("mousedown", e.nativeEvent);
					}
				}
			},
			[bounds, operation, emiter, history],
		);

		const updateBounds = useCallback(
			(e: MouseEvent) => {
				if (
					!resizeOrMoveRef.current ||
					!pointRef.current ||
					!boundsRef.current ||
					!bounds
				) {
					return;
				}
				const points = getPoints(
					e,
					resizeOrMoveRef.current,
					pointRef.current,
					boundsRef.current,
				);
				boundsDispatcher.set(
					getBoundsByPoints(
						points[0],
						points[1],
						bounds,
						width,
						height,
						resizeOrMoveRef.current,
					),
				);
			},
			[width, height, bounds, boundsDispatcher],
		);

		useLayoutEffect(() => {
			if (!image || !bounds || !canvasRef.current) {
				ctxRef.current = null;
				return;
			}

			if (!ctxRef.current) {
				ctxRef.current = canvasRef.current.getContext("2d");
			}

			draw();
		}, [image, bounds, draw]);

		useEffect(() => {
			const onMouseMove = (e: MouseEvent) => {
				if (!operation) {
					if (
						!resizeOrMoveRef.current ||
						!pointRef.current ||
						!boundsRef.current
					) {
						return;
					}
					updateBounds(e);
				} else {
					emiter.emit("mousemove", e);
				}
			};

			const onMouseUp = (e: MouseEvent) => {
				if (!operation) {
					if (
						!resizeOrMoveRef.current ||
						!pointRef.current ||
						!boundsRef.current
					) {
						return;
					}
					updateBounds(e);
					resizeOrMoveRef.current = undefined;
					pointRef.current = null;
					boundsRef.current = null;
				} else {
					emiter.emit("mouseup", e);
				}
			};
			window.addEventListener("mousemove", onMouseMove);
			window.addEventListener("mouseup", onMouseUp);

			return () => {
				window.removeEventListener("mousemove", onMouseMove);
				window.removeEventListener("mouseup", onMouseUp);
			};
		}, [updateBounds, operation, emiter]);

		// 放到最后，保证ctxRef.current存在
		useImperativeHandle<
			CanvasRenderingContext2D | null,
			CanvasRenderingContext2D | null
		>(ref, () => ctxRef.current);

		return (
			<div
				className="screenshots-canvas"
				style={{
					width: bounds?.width || 0,
					height: bounds?.height || 0,
					transform: bounds
						? `translate(${bounds.x}px, ${bounds.y}px)`
						: "none",
				}}
			>
				<div className="screenshots-canvas-body">
					{/* 保证一开始就显示，减少加载时间 */}
					<img
						className="screenshots-canvas-image"
						src={url}
						style={{
							width,
							height,
							transform: bounds
								? `translate(${-bounds.x}px, ${-bounds.y}px)`
								: "none",
						}}
					/>
					<canvas
						ref={canvasRef}
						className="screenshots-canvas-panel"
						width={bounds?.width || 0}
						height={bounds?.height || 0}
					/>
				</div>
				<div
					className="screenshots-canvas-mask"
					style={{
						cursor,
					}}
					onMouseDown={(e) => onMouseDown(e, "move")}
				>
					{isCanResize && (
						<div className="screenshots-canvas-size">
							{bounds.width} &times; {bounds.height}
						</div>
					)}
				</div>
				{borders.map((border) => {
					return (
						<div
							key={border}
							className={`screenshots-canvas-border-${border}`}
						/>
					);
				})}
				{isCanResize &&
					resizePoints.map((resizePoint) => {
						return (
							<div
								key={resizePoint}
								className={`screenshots-canvas-point-${resizePoint}`}
								onMouseDown={(e) => onMouseDown(e, resizePoint)}
							/>
						);
					})}
			</div>
		);
	}),
);
