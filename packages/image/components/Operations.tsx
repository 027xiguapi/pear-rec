import * as React from "react";
import classnames from "classnames";
import CSSMotion from "rc-motion";
import Portal from "@rc-component/portal";
import { MIN_SCALE, MAX_SCALE } from "./previewConfig";
import type { PreviewProps } from "./Preview";

interface OperationsProps
	extends Pick<
		PreviewProps,
		| "visible"
		| "maskTransitionName"
		| "getContainer"
		| "prefixCls"
		| "rootClassName"
		| "icons"
		| "countRender"
		| "onClose"
	> {
	showSwitch: boolean;
	showProgress: boolean;
	current: number;
	count: number;
	scale: number;
	onSwitchLeft: React.MouseEventHandler<HTMLDivElement>;
	onSwitchRight: React.MouseEventHandler<HTMLDivElement>;
	onZoomIn: () => void;
	onZoomOut: () => void;
	onRotateRight: () => void;
	onRotateLeft: () => void;
	onFlipX: () => void;
	onFlipY: () => void;
}

const Operations: React.FC<OperationsProps> = (props) => {
	const {
		visible,
		maskTransitionName,
		getContainer,
		prefixCls,
		rootClassName,
		icons,
		countRender,
		showSwitch,
		showProgress,
		current,
		count,
		scale,
		onSwitchLeft,
		onSwitchRight,
		onClose,
		onZoomIn,
		onZoomOut,
		onRotateRight,
		onRotateLeft,
		onFlipX,
		onFlipY,
	} = props;
	const {
		rotateLeft,
		rotateRight,
		zoomIn,
		zoomOut,
		close,
		left,
		right,
		flipX,
		flipY,
		openImg,
		printer,
		download,
		reset,
		fullScreen,
	} = icons;
	const toolClassName = `${prefixCls}-operations-operation`;
	const iconClassName = `${prefixCls}-operations-icon`;
	const tools = [
		{
			icon: zoomIn,
			onClick: onZoomIn,
			type: "zoomIn",
			disabled: scale === MAX_SCALE,
		},
		{
			icon: zoomOut,
			onClick: onZoomOut,
			type: "zoomOut",
			disabled: scale === MIN_SCALE,
		},
		{
			icon: rotateRight,
			onClick: onRotateRight,
			type: "rotateRight",
		},
		{
			icon: rotateLeft,
			onClick: onRotateLeft,
			type: "rotateLeft",
		},
		{
			icon: flipX,
			onClick: onFlipX,
			type: "flipX",
		},
		{
			icon: flipY,
			onClick: onFlipY,
			type: "flipY",
		},
		{
			icon: openImg,
			type: "openImg",
		},
		{
			icon: printer,
			type: "printer",
		},
		{
			icon: download,
			type: "download",
		},
		{
			icon: reset,
			type: "reset",
		},
		{
			icon: fullScreen,
			type: "fullScreen",
		},
	];

	const operations = (
		<>
			{showSwitch && (
				<>
					<div
						className={classnames(`${prefixCls}-switch-left`, {
							[`${prefixCls}-switch-left-disabled`]: current === 0,
						})}
						onClick={onSwitchLeft}
					>
						{left}
					</div>
					<div
						className={classnames(`${prefixCls}-switch-right`, {
							[`${prefixCls}-switch-right-disabled`]: current === count - 1,
						})}
						onClick={onSwitchRight}
					>
						{right}
					</div>
				</>
			)}
			<ul className={`${prefixCls}-operations`}>
				{/* {showProgress && (
					<li className={`${prefixCls}-operations-progress`}>
						{countRender?.(current + 1, count) ?? `${current + 1} / ${count}`}
					</li>
				)} */}
				{tools.map(({ icon, onClick, type, disabled }) => (
					<li
						className={classnames(toolClassName, {
							[`${prefixCls}-operations-operation-${type}`]: true,
							[`${prefixCls}-operations-operation-disabled`]: !!disabled,
						})}
						onClick={onClick}
						key={type}
					>
						{React.isValidElement(icon)
							? React.cloneElement<{ className?: string }>(icon, {
									className: iconClassName,
							  })
							: icon}
					</li>
				))}
			</ul>
		</>
	);

	return (
		<CSSMotion visible={visible} motionName={maskTransitionName}>
			{({ className, style }) => (
				<Portal open getContainer={getContainer ?? document.body}>
					<div
						className={classnames(
							`${prefixCls}-operations-wrapper`,
							className,
							rootClassName,
						)}
						style={style}
					>
						{operations}
					</div>
				</Portal>
			)}
		</CSSMotion>
	);
};

export default Operations;
