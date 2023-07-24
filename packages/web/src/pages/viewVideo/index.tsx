import React, { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Plyr from "plyr";
import { Button, Empty } from "antd";
import defaultVideo from "/video/chrome.webm";
import "plyr/dist/plyr.css";
import "./index.scss";

const ViewVideo = () => {
	const [search, setSearch] = useSearchParams();
	const [source, setSource] = useState("");
	const sourceRef = useRef<HTMLSourceElement>(null);

	useEffect(() => {
		if (source) {
			const player = new Plyr("#player");
		} else {
			setVideo();
		}
	}, [source]);

	async function setVideo() {
		const videoUrl = search.get("url");
		if (videoUrl) {
			setSource(videoUrl);
		} else {
			const video = await window.electronAPI?.invokeVvSetVideo();
			setSource(video || defaultVideo);
		}
	}

	return (
		<div className="viewVideo">
			{source ? (
				<video id="player" playsInline controls>
					<source ref={sourceRef} src={source} type="video/mp4" />
				</video>
			) : (
				<Empty
					image="/imgs/svg/empty.svg"
					imageStyle={{ height: 60 }}
					description={<span>暂无视频</span>}
				>
					<Button type="primary">打开视频</Button>
				</Empty>
			)}
		</div>
	);
};

export default ViewVideo;
