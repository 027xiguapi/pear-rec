import React, { memo, ReactElement } from "react";
import ScreenshotsSize from "../ScreenshotsSize";
import ScreenshotsColor from "../ScreenshotsColor";
import "./index.scss";

export interface SizeColorProps {
	size: number;
	color: string;
	onSizeChange: (value: number) => void;
	onColorChange: (value: string) => void;
}

export default memo(function ScreenshotsSizeColor({
	size,
	color,
	onSizeChange,
	onColorChange,
}: SizeColorProps): ReactElement {
	return (
		<div className="screenshots-sizecolor">
			<ScreenshotsSize value={size} onChange={onSizeChange} />
			<ScreenshotsColor value={color} onChange={onColorChange} />
		</div>
	);
});
