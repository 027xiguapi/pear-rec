import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import Plyr from "plyr";
import { Button, Empty, Drawer } from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import ininitApp from "../../pages/main";
import { useApi } from "../../api";
import { useUserApi } from "../../api/user";
import "plyr/dist/plyr.css";
import styles from "./index.module.scss";

const defaultVideo = "/video/chrome.webm";
const ViewVideo = () => {
	const { t } = useTranslation();
	const api = useApi();
	const userApi = useUserApi();
	let refPlayer = useRef<Plyr>();
	const inputRef = useRef(null);
	const [user, setUser] = useState<any>({});
	const [source, setSource] = useState("");
	const [videos, setVideos] = useState([]);
	const [videoIndex, setVideoIndex] = useState(0);
	const [open, setOpen] = useState(false);

	useEffect(() => {
		if (source) {
			const player = new Plyr("#player");
			refPlayer.current = player;
		} else {
			handleDrop();
			getCurrentUser();
		}
	}, [source]);

	useEffect(() => {
		user.id && initVideo();
	}, [user]);

	async function getCurrentUser() {
		try {
			const res = (await userApi.getCurrentUser()) as any;
			if (res.code == 0) {
				setUser(res.data);
			}
		} catch (err) {
			console.log(err);
		}
	}

	async function initVideo() {
		const paramsString = location.search;
		const searchParams = new URLSearchParams(paramsString);
		const videoUrl = searchParams.get("videoUrl");
		if (videoUrl) {
			if (videoUrl.substring(0, 4) == "blob") {
				setSource(videoUrl);
			} else {
				userApi.editUser(user.id, { ...user, historyVideo: videoUrl });
				const res = (await api.getVideos(videoUrl)) as any;
				if (res.code == 0) {
					setVideos(res.data.videos);
					setVideoIndex(res.data.currentIndex);
					setSource(res.data.videos[res.data.currentIndex].url);
				} else {
					setSource(defaultVideo);
				}
			}
		}
	}

	function setVideo(index: number) {
		setSource(videos[index].url);
		setVideoIndex(index);
	}

	// function formatVideoUrl(videoUrl: any) {
	// 	if (videoUrl?.search(/^blob:/) == 0) {
	// 		return videoUrl;
	// 	}
	// 	videoUrl = videoUrl && videoUrl.replace(/\\/g, "/");
	// 	return videoUrl && `pearrec:///${videoUrl}`;
	// }

	function handleDrop() {
		document.addEventListener("drop", (e) => {
			e.preventDefault();
			e.stopPropagation();

			const files = e.dataTransfer!.files;
			refPlayer.current!.source = {
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

	function getVideoUpload() {
		inputRef.current.click();
	}

	function handleVideoUpload(event) {
		const file = event.target.files[0];
		setSource(window.URL.createObjectURL(file));
	}

	function showDrawer() {
		setOpen(true);
	}

	function closeDrawer() {
		setOpen(false);
	}

	return (
		<div className={styles.viewVideo}>
			{source ? (
				<video id="player" playsInline controls src={source}></video>
			) : (
				<Empty
					image="./imgs/svg/empty.svg"
					imageStyle={{ height: 60 }}
					description={<span>{t("viewVideo.emptyDescription")}</span>}
				>
					<Button type="primary" onClick={getVideoUpload}>
						{t("viewVideo.emptyBtn")}
					</Button>
					<input
						type="file"
						accept="video/*"
						className="inputRef"
						ref={inputRef}
						onChange={handleVideoUpload}
					/>
				</Empty>
			)}
			<div className={`sidebar ${open ? "open" : "close"}`}>
				<LeftOutlined onClick={showDrawer} />
			</div>
			<Drawer
				title="视频列表"
				placement="right"
				onClose={closeDrawer}
				open={open}
				className="videoList"
				getContainer={false}
				mask={false}
			>
				{videos.map((video, index) => (
					<p
						className={`videoName ${index == videoIndex ? "current" : ""}`}
						key={index}
						onDoubleClick={() => setVideo(index)}
						title={video.name}
					>
						{video.name}
					</p>
				))}
			</Drawer>
		</div>
	);
};

ininitApp(ViewVideo);
export default ViewVideo;
