import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import Plyr from "plyr";
import { Button, Empty } from "antd";
import ininitApp from "@/pages/main";
import "plyr/dist/plyr.css";
import styles from "./index.module.scss";

const defaultVideo = "/video/chrome.webm";
const ViewVideo = () => {
	const { t } = useTranslation();
	let refPlayer = useRef<Plyr>();
	const [source, setSource] = useState("");

	useEffect(() => {
		if (source) {
			const player = new Plyr("#player");
			refPlayer.current = player;
		} else {
			setVideo();
			handleDrop();
		}
	}, [source]);

	async function setVideo() {
		const paramsString = location.search;
		const searchParams = new URLSearchParams(paramsString);
		const videoUrl = searchParams.get("videoUrl");
		videoUrl && (await window.electronAPI?.sendVvSetHistoryVideo(videoUrl));
		const video =
			formatVideoUrl(
				videoUrl || (await window.electronAPI?.invokeVvGetHistoryVideo()),
			) || defaultVideo;
		setSource(video);
	}

	function formatVideoUrl(videoUrl: any) {
		if (videoUrl?.search(/^blob:/) == 0) {
			return videoUrl;
		}
		videoUrl = videoUrl && videoUrl.replace(/\\/g, "/");
		return videoUrl && `pearrec:///${videoUrl}`;
	}

	function handleDrop() {
		document.addEventListener("drop", (e) => {
			e.preventDefault();
			e.stopPropagation();

			const files = e.dataTransfer.files;
			refPlayer.current.source = {
				type: "video",
				sources: [
					{
						src: window.URL.createObjectURL(files[0]),
						type: "video/mp4",
					},
				],
			};
		});
		document.addEventListener("dragover", (e) => {
			e.preventDefault();
			e.stopPropagation();
		});
	}

	return (
		<div className={styles.viewVideo}>
			{source ? (
				<video id="player" playsInline controls src={source}>
					{/* <source src={source} type="video/mp4" /> */}
				</video>
			) : (
				<Empty
					image="./imgs/svg/empty.svg"
					imageStyle={{ height: 60 }}
					description={<span>t("viewVideo.emptyDescription")</span>}
				>
					<Button type="primary">{t("viewVideo.emptyBtn")}</Button>
				</Empty>
			)}
		</div>
	);
};

ininitApp(ViewVideo);
export default ViewVideo;
