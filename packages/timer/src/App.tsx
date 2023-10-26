import { useState } from "react";
import useTimer from "./useTimer";
import Timer from "./Timer/index";
import "./App.css";

function App() {
	const { seconds, minutes, hours, start, pause, resume, reset } = useTimer();

	const [isShowTitle] = useState(true);
	return (
		<div className="separator">
			<h2>Timer Demo</h2>
			<div className="timer">
				<Timer
					seconds={seconds}
					minutes={minutes}
					hours={hours}
					isShowTitle={isShowTitle}
				/>
			</div>
			<button onClick={start}>Start</button>
			<button onClick={pause}>Pause</button>
			<button onClick={resume}>Resume</button>
			<button onClick={reset}>Reset</button>
		</div>
	);
}

export default App;
