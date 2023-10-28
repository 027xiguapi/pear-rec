import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import ininitApp from "../../pages/main";
import { useApi } from "../../api";
import { useUserApi } from "../../api/user";
import SelectMedia from "../../components/recorderScreen/SelectMedia";
import CropRecorder from "../../components/recorderScreen/CropRecorder";
import ScreenRecorder from "../../components/recorderScreen/ScreenRecorder";
import "@pear-rec/timer/src/Timer/index.module.scss";
import styles from "./index.module.scss";

const RecorderScreen = () => {
	const userApi = useUserApi();
	const userRef = useRef({} as any);
	const videoRef = useRef(null);
	const iframeRef = useRef(null);
	const [isIframe, setIsIframe] = useState(true);
	const [isMedia, setIsMedia] = useState(false);

	useEffect(() => {
		userRef.current.id || getCurrentUser();
	}, []);

	async function getCurrentUser() {
		try {
			const res = (await userApi.getCurrentUser()) as any;
			if (res.code == 0) {
				userRef.current = res.data;
			}
		} catch (err) {
			console.log(err);
		}
	}

	function setMediaStream(mediaStream) {
		videoRef.current!.srcObject = mediaStream;
		setIsIframe(false);
		setIsMedia(true);
	}

	function setIframeRef(value) {
		iframeRef.current.src = value;
		setIsIframe(true);
		setIsMedia(true);
	}

	return (
		<div className={styles.recorderScreen}>
			{window.isElectron ? (
				<ScreenRecorder />
			) : (
				<>
					{isMedia ? (
						<CropRecorder />
					) : (
						<SelectMedia
							setIframeRef={setIframeRef}
							setMediaStream={setMediaStream}
						/>
					)}
					<iframe
						ref={iframeRef}
						className={`iframeRef ${isIframe ? "show" : "hide"}`}
						src=""
						width={"100%"}
						height={"100%"}
						frameBorder="0"
					></iframe>
					<video
						ref={videoRef}
						className={`videoRef ${isIframe ? "hide" : "show"}`}
						autoPlay
						muted
						playsInline
					></video>
				</>
			)}
		</div>
	);
};

ininitApp(RecorderScreen);
export default RecorderScreen;
