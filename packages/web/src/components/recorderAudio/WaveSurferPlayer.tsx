import React, { useState, useRef, useEffect, useCallback } from "react";
import { Button, Space, Divider } from "antd";
import WaveSurfer from "wavesurfer.js";
import { saveAs } from "file-saver";

const useWavesurfer = (containerRef, options) => {
	const [wavesurfer, setWavesurfer] = useState(null);

	useEffect(() => {
		if (!containerRef.current) return;

		const ws = WaveSurfer.create({
			...options,
			container: containerRef.current,
		});

		setWavesurfer(ws);

		ws.on("interaction", () => {
			ws.play();
		});

		return () => {
			ws.destroy();
		};
	}, [options, containerRef]);

	return wavesurfer;
};

const WaveSurferPlayer = (props) => {
	const containerRef = useRef();
	const [isPlaying, setIsPlaying] = useState(false);
	const [currentTime, setCurrentTime] = useState(0);
	const wavesurfer = useWavesurfer(containerRef, props);

	const onPlayClick = useCallback(() => {
		wavesurfer.isPlaying() ? wavesurfer.pause() : wavesurfer.play();
	}, [wavesurfer]);

	const onDownloadClick = useCallback(() => {
		const url = wavesurfer.getMediaElement().src;

		if (window.isElectron) {
			window.electronAPI.sendRaDownloadRecord(url);
		} else {
			saveAs(url);
		}
	}, [wavesurfer]);

	const onRangeChange = useCallback(
		(e) => {
			const minPxPerSec = e.target.valueAsNumber;
			wavesurfer.zoom(minPxPerSec);
		},
		[wavesurfer],
	);

	const onScrollbarChange = useCallback(
		(e) => {
			wavesurfer.setOptions({
				scrollbar: e.target.checked,
			});
		},
		[wavesurfer],
	);

	const onFillParentChange = useCallback(
		(e) => {
			wavesurfer.setOptions({
				fillParent: e.target.checked,
			});
		},
		[wavesurfer],
	);

	const onAutoCenterChange = useCallback(
		(e) => {
			wavesurfer.setOptions({
				autoCenter: e.target.checked,
			});
		},
		[wavesurfer],
	);

	useEffect(() => {
		if (!wavesurfer) return;

		setCurrentTime(0);
		setIsPlaying(false);

		const subscriptions = [
			wavesurfer.on("play", () => setIsPlaying(true)),
			wavesurfer.on("pause", () => setIsPlaying(false)),
			wavesurfer.on("timeupdate", (currentTime) => setCurrentTime(currentTime)),
		];

		return () => {
			subscriptions.forEach((unsub) => unsub());
		};
	}, [wavesurfer]);

	return (
		<>
			<label>
				Zoom:{" "}
				<input
					type="range"
					min="10"
					max="1000"
					value="100"
					onChange={onRangeChange}
				/>
			</label>
			<label>
				<input
					type="checkbox"
					checked
					value="scrollbar"
					onChange={onScrollbarChange}
				/>{" "}
				Scroll bar
			</label>
			<label>
				<input
					type="checkbox"
					checked
					value="fillParent"
					onChange={onFillParentChange}
				/>{" "}
				Fill parent
			</label>
			<label>
				<input
					type="checkbox"
					checked
					value="autoCenter"
					onChange={onAutoCenterChange}
				/>{" "}
				Auto center
			</label>
			<div ref={containerRef} style={{ minHeight: "120px" }} />

			<Divider />
			<Space wrap>
				<Button type="primary" onClick={onPlayClick}>
					{isPlaying ? "暂停" : "播放"}
				</Button>
				<Button type="primary" onClick={onDownloadClick}>
					下载
				</Button>
			</Space>
			<p>Seconds played: {currentTime}</p>
		</>
	);
};

export default WaveSurferPlayer;
