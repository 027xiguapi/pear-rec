import React, { useEffect, useRef, useState } from "react";
import Plyr from "plyr";
import "plyr/dist/plyr.css";
import { ipcRenderer } from "electron";
import "./index.scss";

const ViewVideo = () => {
	const [source, setSource] = useState("");
	const sourceRef = useRef<HTMLSourceElement>(null);
	useEffect(() => {
		ipcRenderer.on("vv:set-video", (e, video) => {
			setSource(video);
		});
	}, []);

	useEffect(() => {
		if (source) {
			const player = new Plyr("#player");
		}
	}, [source]);

	return (
		<div className="viewVideo">
			<video id="player" playsInline controls>
				<source ref={sourceRef} src={source} type="video/mp4" />
			</video>
		</div>
	);
};

export default ViewVideo;
