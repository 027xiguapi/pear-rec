import React, { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Radio, Card, Divider, Switch, Space, Button } from "antd";
import UploadAudio from "../upload/UploadAudio";
import WaveSurfer from "wavesurfer.js";
import RecordPlugin from "./plugins/recordPlugin";
import dayjs from "dayjs";

const AudioRecorder = (props) => {
	const { t } = useTranslation();
	const micRef = useRef();
	const [record, setRecord] = useState<any>(null);
	const [isDisabled, setIsDisabled] = useState(true);
	const [value, setValue] = useState("");

	useEffect(() => {
		if (!micRef.current) return;
		const wavesurfer = WaveSurfer.create({
			container: micRef.current,
			waveColor: "rgb(200, 0, 200)",
			progressColor: "rgb(100, 0, 100)",
		});

		const record = wavesurfer.registerPlugin(RecordPlugin.create() as any);
		record.on("record-end", async (blob) => {
			const recordedUrl = URL.createObjectURL(blob);
			const duration = await record.getDuration(blob);
			const type = blob.type.split(";")[0].split("/")[1] || "webm";
			const createdAt = dayjs().format();
			const audio = {
				url: recordedUrl,
				name: `${createdAt}.${type}`,
				type: type,
				createdAt: createdAt,
				duration,
			};
			props.onSetAudios((prevState) => [audio, ...prevState]);
		});
		setRecord(record);
	}, [micRef]);

	function startRecord() {
		setIsDisabled(true);
		record.startRecording().then(() => {
			setIsDisabled(false);
			setValue("start");
		});
	}

	function stopRecord() {
		if (record.isRecording()) {
			record.stopRecording();
			setValue("stop");
		}
	}

	function destroyRecord() {
		setIsDisabled(true);
		record.stopMic();
	}

	function openRecord() {
		setIsDisabled(false);
		record.startMic();
	}

	function pauseRecord() {
		record.pauseRecording();
	}

	function resumeRecord() {
		record.resumeRecording();
	}

	function changeMic(checked) {
		checked ? openRecord() : destroyRecord();
	}

	async function handleUploadAudios(files) {
		for (let i = 0; i < files.length; i++) {
			let file = files[i];
			const duration = await record.getDuration(file);
			const url = window.URL.createObjectURL(file);
			const createdAt = dayjs(file.lastModifiedDate).format();
			const type = file.type;
			const audio = {
				url: url,
				name: file.name,
				type: type,
				createdAt: createdAt,
				duration: duration,
			};
			props.onSetAudios((prevState) => [audio, ...prevState]);
		}
	}

	return (
		<Card title="设置">
			<Space>
				麦克风
				<Switch
					checkedChildren="开启"
					unCheckedChildren="关闭"
					onChange={changeMic}
				/>
				<UploadAudio handleUploadAudios={handleUploadAudios} />
			</Space>
			<Divider />
			<Space>
				操作
				<Radio.Group buttonStyle="solid" disabled={isDisabled} value={value}>
					<Radio.Button value="start" onClick={startRecord}>
						开始
					</Radio.Button>
					<Radio.Button value="stop" onClick={stopRecord}>
						保存
					</Radio.Button>
					<Radio.Button value="pause" onClick={pauseRecord}>
						暂停
					</Radio.Button>
					<Radio.Button value="resume" onClick={resumeRecord}>
						继续
					</Radio.Button>
				</Radio.Group>
				声波
				<Radio.Group buttonStyle="solid" value={"WaveView"}>
					<Radio.Button value="WaveView">WaveView</Radio.Button>
					<Radio.Button value="SurferView" disabled>
						SurferView
					</Radio.Button>
					<Radio.Button value="Histogram" disabled>
						Histogram
					</Radio.Button>
				</Radio.Group>
			</Space>
			<Divider />
			<div id="mic" ref={micRef}></div>
		</Card>
	);
};

export default AudioRecorder;
