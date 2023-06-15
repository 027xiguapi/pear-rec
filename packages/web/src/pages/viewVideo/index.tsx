import React, { useEffect, useRef, useState } from "react";
import Plyr from "plyr";
import { Button, Empty } from "antd";
import defaultVideo from "@/assets/video/chrome.webm";
import "plyr/dist/plyr.css";
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
		const video = await window.electronAPI?.invokeVvSetVideo();
		setSource(video || defaultVideo);
	}

	return (
		<div className="viewVideo">
			{source ? (
				<video id="player" playsInline controls>
					<source ref={sourceRef} src={source} type="video/mp4" />
				</video>
			) : (
				<Empty
					image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
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
