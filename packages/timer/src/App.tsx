import { useState } from "react";
import { useStopwatch } from "react-timer-hook";
import Timer from "./Timer/index";
import "./App.css";

function App() {
	const { seconds, minutes, hours, days, start, pause, reset } = useStopwatch({
		autoStart: true,
	});

	const [isShowTitle] = useState(true);
	return (
		<div className="separator">
			<h2>UseStopwatch Demo</h2>
			<div className="timer">
				<Timer
					seconds={seconds}
					minutes={minutes}
					hours={hours}
					days={days}
					isShowTitle={isShowTitle}
				/>
			</div>
			<button onClick={start}>Start</button>
			<button onClick={pause}>Pause</button>
			<button onClick={() => reset}>Reset</button>
		</div>
	);
}

export default App;
