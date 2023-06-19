import React, { useCallback, useEffect, useState } from "react";
import Screenshots from "../Screenshots";
import { Bounds } from "../Screenshots/types";
import { Lang } from "../Screenshots/zh_CN";
import "./app.scss";

export interface Display {
	id: number;
	x: number;
	y: number;
	width: number;
	height: number;
}

export default function App(): JSX.Element {
	const [url, setUrl] = useState<string | undefined>(undefined);
	const [width, setWidth] = useState(window.innerWidth);
	const [height, setHeight] = useState(window.innerHeight);
	const [display, setDisplay] = useState<Display | undefined>(undefined);
	const [lang, setLang] = useState<Lang | undefined>(undefined);

	const onSave = useCallback(
		async (blob: Blob | null, bounds: Bounds) => {
			if (!display || !blob) {
				return;
			}
			window.screenshots.save(await blob.arrayBuffer(), { bounds, display });
		},
		[display],
	);

	const onCancel = useCallback(() => {
		window.screenshots.cancel();
	}, []);

	const onOk = useCallback(
		async (blob: Blob | null, bounds: Bounds) => {
			if (!display || !blob) {
				return;
			}
			window.screenshots.ok(await blob.arrayBuffer(), { bounds, display });
		},
		[display],
	);

	useEffect(() => {
		const onSetLang = (lang: Lang) => {
			setLang(lang);
		};

		const onCapture = (display: Display, dataURL: string) => {
			setDisplay(display);
			setUrl(dataURL);
		};

		const onReset = () => {
			setUrl(undefined);
			setDisplay(undefined);
			// 确保截图区域被重置
			requestAnimationFrame(() => window.screenshots.reset());
		};

		window.screenshots.on("setLang", onSetLang);
		window.screenshots.on("capture", onCapture);
		window.screenshots.on("reset", onReset);
		// 告诉主进程页面准备完成
		window.screenshots.ready();
		return () => {
			window.screenshots.off("capture", onCapture);
			window.screenshots.off("setLang", onSetLang);
			window.screenshots.off("reset", onReset);
		};
	}, []);

	useEffect(() => {
		const onResize = () => {
			setWidth(window.innerWidth);
			setHeight(window.innerHeight);
		};

		window.addEventListener("resize", onResize);
		return () => {
			window.removeEventListener("resize", onResize);
		};
	}, [onCancel]);

	return (
		<div className="body">
			<Screenshots
				url={url}
				width={width}
				height={height}
				lang={lang}
				onSave={onSave}
				onCancel={onCancel}
				onOk={onOk}
			/>
		</div>
	);
}
