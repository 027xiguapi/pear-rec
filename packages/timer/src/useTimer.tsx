import React, { useState, useEffect } from "react";

const useTimer = () => {
	const [startTime, setStartTime] = useState<any>(null);
	const [elapsedTime, setElapsedTime] = useState(0);
	const [pausedTime, setPausedTime] = useState(0);
	const [isRunning, setIsRunning] = useState(false);
	const [isPaused, setIsPaused] = useState(false);

	const [hours, setHours] = useState(0);
	const [minutes, setMinutes] = useState(0);
	const [seconds, setSeconds] = useState(0);

	useEffect(() => {
		let timerInterval: any;

		if (isRunning) {
			timerInterval = setInterval(() => {
				setElapsedTime(Date.now() - startTime + pausedTime);
			}, 1000);
		}

		return () => clearInterval(timerInterval);
	}, [isRunning, startTime]);

	useEffect(() => {
		const hours = Math.floor((elapsedTime / (1000 * 60 * 60)) % 24);
		const minutes = Math.floor((elapsedTime / (1000 * 60)) % 60);
		const seconds = Math.floor((elapsedTime / 1000) % 60);

		setHours(hours);
		setMinutes(minutes);
		setSeconds(seconds);
	}, [elapsedTime]);

	useEffect(() => {
		isPaused ? setPausedTime(elapsedTime) : setPausedTime(0);
	}, [isPaused]);

	function start() {
		setStartTime(Date.now());
		setIsRunning(true);
	}

	function pause() {
		setIsPaused(true);
		setPausedTime(elapsedTime);
		setIsRunning(false);
	}

	function resume() {
		setIsPaused(false);
		setStartTime(Date.now());
		setIsRunning(true);
	}

	function reset() {
		setElapsedTime(0);
		setIsRunning(false);
	}

	return {
		start,
		pause,
		resume,
		reset,
		seconds,
		minutes,
		hours,
		isRunning,
		isPaused,
	};
};

export default useTimer;
