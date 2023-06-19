import React, { ReactElement, useCallback } from "react";
import Screenshots from "../Screenshots";
import { Bounds } from "../Screenshots/types";
import "./app.scss";
import imageUrl from "./image.jpg";

export default function App(): ReactElement {
	const onSave = useCallback((blob: Blob | null, bounds: Bounds) => {
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
	const onOk = useCallback((blob: Blob | null, bounds: Bounds) => {
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
