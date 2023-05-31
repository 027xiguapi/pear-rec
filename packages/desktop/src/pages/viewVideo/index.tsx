import React, { useEffect, useRef, useState } from "react";
import Plyr from "plyr";
import "plyr/dist/plyr.css";
import { ipcRenderer } from "electron";
import "./index.scss";

const ViewVideo = () => {
	const [source, setSource] = useState("");
	const sourceRef = useRef<HTMLSourceElement>(null);

	useEffect(() => {
		setVideo();
		if (source) {
			const player = new Plyr("#player");
		}
	}, [source]);

	async function setVideo() {
		const video = await ipcRenderer.invoke("vv:set-video");
		setSource(video);
	}

	return (
		<div className="viewVideo">
			<video id="player" playsInline controls>
				<source ref={sourceRef} src={source} type="video/mp4" />
			</video>
		</div>
	);
};

export default ViewVideo;
