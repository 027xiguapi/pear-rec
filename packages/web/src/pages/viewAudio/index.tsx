import React, { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import APlayer from "APlayer";
import "APlayer/dist/APlayer.min.css";
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
	const [search, setSearch] = useSearchParams();
	const [audio, setAudio] = useState<any>([]);

	useEffect(() => {
		if (audio.length) {
			const options = {
				container: document.getElementById("aplayer"),
        autoplay: true,
				audio: audio,
			};
			const player = new APlayer(options);
		} else {
			init();
		}
	}, [audio]);

	async function init() {
		const audioUrl = search.get("url");
		let audio = [];
		if (audioUrl) {
			await window.electronAPI?.sendVaSetHistoryAudio(audioUrl);
			audio = [{ url: audioUrl, cover: "./imgs/music.png" }];
		}
		window.electronAPI &&
			(audio = await window.electronAPI?.invokeVaGetAudios(audioUrl));
		audio.length || (audio = defaultAudio);

		setAudio(audio);
	}

	return (
		<div className={styles.viewAudio}>
			<div id="aplayer"></div>
		</div>
	);
};

export default ViewAudio;
