import React, { useState, useRef, useEffect, useCallback } from "react";
import { Button, Space, Divider, Slider, Row, Col, Checkbox } from "antd";
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
	const [scrollbar, setScrollbar] = useState(true);
	const [fillParent, setFillParent] = useState(true);
	const [autoCenter, setAutoCenter] = useState(true);
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
		(minPxPerSec) => {
			wavesurfer.zoom(minPxPerSec);
		},
		[wavesurfer],
	);

	const onScrollbarChange = useCallback(
		(e) => {
			wavesurfer.setOptions({
				scrollbar: e.target.checked,
			});
			setScrollbar(e.target.checked);
		},
		[wavesurfer],
	);

	const onFillParentChange = useCallback(
		(e) => {
			wavesurfer.setOptions({
				fillParent: e.target.checked,
			});
			setFillParent(e.target.checked);
		},
		[wavesurfer],
	);

	const onAutoCenterChange = useCallback(
		(e) => {
			wavesurfer.setOptions({
				autoCenter: e.target.checked,
			});
			setAutoCenter(e.target.checked);
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
			<Row className="tools">
				Zoom:
				<Col span={12}>
					<Slider
						defaultValue={100}
						min={10}
						max={1000}
						step={10}
						tooltip={{ open: true, placement: "top" }}
						onChange={onRangeChange}
					/>
				</Col>
				<Col>
					<Checkbox checked={scrollbar} onChange={onScrollbarChange}>
						Scroll bar
					</Checkbox>
					<Checkbox checked={fillParent} onChange={onFillParentChange}>
						Fill parent
					</Checkbox>
					<Checkbox checked={autoCenter} onChange={onAutoCenterChange}>
						Auto center
					</Checkbox>
				</Col>
			</Row>
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
