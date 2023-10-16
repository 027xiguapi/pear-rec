import React, { useEffect, useRef, useState } from "react";
import APlayer from "aplayer";
import ininitApp from "../../pages/main";
import { useApi } from "../../api";
import "aplayer/dist/APlayer.min.css";
import styles from "./index.module.scss";

const defaultAudio = [
	{
		name: "卡农",
		artist: "dylanf",
		url: `./audio/canon.m4a`,
		cover: "./imgs/canon.jpg",
		// cover: "./imgs/music.png",
	},
	{
		name: "rain",
		artist: "rain",
		url: `./audio/rain.mp3`,
		cover: "./imgs/rain.gif",
	},
];

const ViewAudio = () => {
	const api = useApi();
	let refPlayer = useRef<any>();
	const [audio, setAudio] = useState<any>([]);

	useEffect(() => {
		if (audio.length) {
			const options = {
				container: document.getElementById("aplayer"),
				autoplay: true,
				audio: audio,
			};
			const player = new APlayer(options);
			refPlayer.current = player;
		} else {
			init();
			handleDrop();
		}
	}, [audio]);

	async function init() {
		const paramsString = location.search;
		const searchParams = new URLSearchParams(paramsString);
		const audioUrl = searchParams.get("audioUrl");
		let audio = [];
		if (audioUrl) {
			audio = [{ url: audioUrl, cover: "./imgs/music.png" }];
			try {
				const res = (await api.getAudios(audioUrl)) as any;
				if (res.code == 0) {
					audio = res.data;
				}
			} catch (err) {
				console.log(err);
			}
		}
		audio.length || (audio = defaultAudio);
		setAudio(audio);
	}

	function handleDrop() {
		document.addEventListener("drop", (e) => {
			e.preventDefault();
			e.stopPropagation();

			let audios = [];
			for (const file of e.dataTransfer.files) {
				audios.push({
					url: window.URL.createObjectURL(file),
					name: file.name,
					cover: "./imgs/music.png",
				});
			}
			refPlayer.current?.destroy();
			setAudio(audios);
		});
		document.addEventListener("dragover", (e) => {
			e.preventDefault();
			e.stopPropagation();
		});
	}

	return (
		<div className={styles.viewAudio}>
			<div id="aplayer"></div>
		</div>
	);
};

ininitApp(ViewAudio);
export default ViewAudio;
