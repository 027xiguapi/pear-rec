import React, { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Radio, Card, Divider, Switch, Space } from "antd";
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
			const audio = {
				url: recordedUrl,
				type: blob.type.split(";")[0].split("/")[1] || "webm",
				createdAt: dayjs().format(),
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

	return (
		<Card title="设置">
			<Space>
				麦克风
				<Switch
					checkedChildren="开启"
					unCheckedChildren="关闭"
					onChange={changeMic}
				/>
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
