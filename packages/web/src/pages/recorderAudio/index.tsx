import React, { useState } from "react";
import { Space, Card } from "antd";
import WaveSurferPlayer from "../../components/recorderAudio/WaveSurferPlayer";
import AudioRecorder from "../../components/recorderAudio/AudioRecorder";
import Hover from "wavesurfer.js/plugins/hover";
import Timeline from "wavesurfer.js/plugins/timeline";
import ininitApp from "../../pages/main";
import styles from "./index.module.scss";

const RecordAudio = () => {
	const [audios, setAudios] = useState([]);

	function handleSetAudios(audios) {
		setAudios(audios);
	}
	return (
		<div
			className={`${styles.recordAudio} ${
				window.isElectron ? styles.electron : styles.web
			}`}
		>
			<Space direction="vertical" size="middle" style={{ display: "flex" }}>
				<AudioRecorder onSetAudios={handleSetAudios} />
				{audios.map((audio, index) => (
					<Card
						title={`记录_${audios.length - index}(创建时间:${
							audio.createTime
						}, 时长:${parseInt(String(audio.duration / 1000))}秒)`}
						key={index}
					>
						<WaveSurferPlayer
							height={100}
							waveColor="rgb(200, 0, 200)"
							progressColor="rgb(100, 0, 100)"
							url={audio.url}
							minPxPerSec={100}
							plugins={[
								Timeline.create(),
								Hover.create({
									lineColor: "#ff0000",
									lineWidth: 2,
									labelBackground: "#555",
									labelColor: "#fff",
									labelSize: "11px",
								}),
							]}
						/>
					</Card>
				))}
			</Space>
		</div>
	);
};

ininitApp(RecordAudio);
export default RecordAudio;
