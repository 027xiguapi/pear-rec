import React, { ReactElement, useCallback } from "react";
import Screenshots from "@pear-rec/screenshot";
import "@pear-rec/screenshot/lib/style.css";
import "./app.scss";
import imageUrl from "/imgs/th.webp";

export default function App() {
	const onSave = useCallback((blob, bounds) => {
		console.log("save", blob, bounds);
		if (blob) {
			const url = URL.createObjectURL(blob);
			console.log(url);
			window.open(url);
		}
	}, []);
	const onCancel = useCallback(() => {
		console.log("cancel");
	}, []);
	const onOk = useCallback((blob, bounds) => {
		console.log("ok", blob, bounds);
		if (blob) {
			const url = URL.createObjectURL(blob);
			console.log(url);
			window.open(url);
		}
	}, []);

	return (
		<div className="body">
			<Screenshots
				url={imageUrl}
				width={window.innerWidth}
				height={window.innerHeight}
				lang={{
					operation_rectangle_title: "Rectangle",
				}}
				onSave={onSave}
				onCancel={onCancel}
				onOk={onOk}
			/>
		</div>
	);
}
