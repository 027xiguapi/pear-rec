import React, {
	useEffect,
	useState,
	useImperativeHandle,
	forwardRef,
} from "react";

const Wavesurfer = forwardRef((props: any, ref: any) => {
	const [timer, setTimer] = useState<NodeJS.Timer | null>(null);
	const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);
	const [HEIGHT, setHEIGHT] = useState(0);
	const [WIDTH, setWIDTH] = useState(0);
	const [barWidth, setBarWidth] = useState(0);
	const [barHeightList, setBarHeightList] = useState<number[]>([]);
	useEffect(() => {
		initFrame();
	}, []);
	useEffect(() => {
		renderFrame();
	}, [barHeightList]);

	useImperativeHandle(ref, () => ({
		play,
		pause,
		stop,
		reset,
	}));

	function initFrame() {
		const bufferLength = 100;
		const canvas = document.getElementById("canvas") as HTMLCanvasElement;
		const ctx = canvas.getContext("2d");
		setCtx(ctx);
		const width = canvas.width;
		setWIDTH(width);
		const height = canvas.height;
		setHEIGHT(height);
		const barWidth = width / bufferLength - 2;
		setBarWidth(barWidth);
		let barHeightList = [];
		for (let i = 0; i < bufferLength; i++) {
			barHeightList.push(10);
		}
		setBarHeightList(barHeightList);
	}

	function setFrame() {
		const barHeight = HEIGHT / 2 + (HEIGHT * Math.random()) / 2;
		barHeightList.shift();
		barHeightList.push(barHeight);
		renderFrame();
	}

	function renderFrame() {
		if (ctx) {
			ctx.clearRect(0, 0, WIDTH, HEIGHT);
			for (let i = 0, x = 0; i < barHeightList.length; i++) {
				const barHeight = barHeightList[i];
				ctx.fillStyle = "rgb(0,0,0)";
				ctx.fillRect(x, (HEIGHT - barHeight) / 2, barWidth, barHeight);
				x += barWidth + 2;
			}
		}
	}

	function play() {
		const timer = setInterval(() => {
			setFrame();
		}, 150);

		setTimer(timer);
	}
	function pause() {
		timer && clearInterval(timer);
	}
	function stop() {
		timer && clearInterval(timer);
		setTimer(null);
		initFrame();
	}
	function reset() {
		timer && clearInterval(timer);
		setTimer(null);
		initFrame();
	}

	return (
		<div className="wavesurfer">
			<canvas id="canvas"></canvas>
		</div>
	);
});

export default Wavesurfer;
