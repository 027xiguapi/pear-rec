import React, {
	ReactElement,
	useRef,
	FocusEvent,
	useLayoutEffect,
	useState,
	memo,
} from "react";
import { createPortal } from "react-dom";
import calculateNodeSize from "./calculateNodeSize";
import "./index.scss";

export interface TextInputProps {
	x: number;
	y: number;
	maxWidth: number;
	maxHeight: number;
	size: number;
	color: string;
	value: string;
	onChange: (value: string) => unknown;
	onBlur: (e: FocusEvent<HTMLTextAreaElement>) => unknown;
}

export default memo(function ScreenshotsTextarea({
	x,
	y,
	maxWidth,
	maxHeight,
	size,
	color,
	value,
	onChange,
	onBlur,
}: TextInputProps): ReactElement {
	const popoverRef = useRef<HTMLDivElement | null>(null);
	const textareaRef = useRef<HTMLTextAreaElement>(null);
	const [width, setWidth] = useState(0);
	const [height, setHeight] = useState(0);

	const getPopoverEl = () => {
		if (!popoverRef.current) {
			popoverRef.current = document.createElement("div");
		}
		return popoverRef.current;
	};

	useLayoutEffect(() => {
		if (popoverRef.current) {
			document.body.appendChild(popoverRef.current);
			requestAnimationFrame(() => {
				textareaRef.current?.focus();
			});
		}

		return () => {
			popoverRef.current?.remove();
		};
	}, []);

	useLayoutEffect(() => {
		if (!textareaRef.current) {
			return;
		}

		const { width, height } = calculateNodeSize(
			textareaRef.current,
			value,
			maxWidth,
			maxHeight,
		);
		setWidth(width);
		setHeight(height);
	}, [value, maxWidth, maxHeight]);

	return createPortal(
		<textarea
			ref={textareaRef}
			className="screenshots-textarea"
			style={{
				color,
				width,
				height,
				maxWidth,
				maxHeight,
				fontSize: size,
				lineHeight: `${size}px`,
				transform: `translate(${x}px, ${y}px)`,
			}}
			value={value}
			onChange={(e) => onChange && onChange(e.target.value)}
			onBlur={(e) => onBlur && onBlur(e)}
		/>,
		getPopoverEl(),
	);
});
