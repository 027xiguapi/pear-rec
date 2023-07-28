import React, { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Plyr from "plyr";
import { Button, Empty } from "antd";
import "plyr/dist/plyr.css";
import styles from "./index.module.scss";

const defaultVideo = "./video/chrome.webm";
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
    videoUrl && await window.electronAPI?.sendVvSetHistoryVideo(videoUrl);
		const video = formatVideoUrl(videoUrl || (await window.electronAPI?.invokeVvGetHistoryVideo())) || defaultVideo;
    console.log(video)
		setSource(video);
	}

  function formatVideoUrl(videoUrl: any) {
    videoUrl = videoUrl && videoUrl.replace(/\\/g, "/");
    return videoUrl && `pearrec:///${videoUrl}`;
  }

	return (
		<div className={styles.viewVideo}>
			{source ? (
				<video id="player" playsInline controls>
					<source ref={sourceRef} src={source} type="video/mp4" />
				</video>
			) : (
				<Empty
					image="./imgs/svg/empty.svg"
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
