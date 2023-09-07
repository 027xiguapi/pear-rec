import { useState } from "react";
import Timer from "@pear-rec/timer";
import "@pear-rec/timer/src/Timer/index.module.scss";
import * as reactTimerHook from "react-timer-hook";
const { useStopwatch } = reactTimerHook;

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
			<div className="button" onClick={start}>
				Start
			</div>
			<div className="button" onClick={pause}>
				Pause
			</div>
			<div className="button" onClick={() => reset}>
				Reset
			</div>
		</div>
	);
}

export default App;
