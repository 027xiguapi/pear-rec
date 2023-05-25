import React, { useState, useRef, useEffect } from "react";

import Stopwatch from "@/components/timer/stopwatch";
import "./index.scss";

const RecordAudio = () => {
	return (
		<div className="recordAudio">
			<Stopwatch />
		</div>
	);
};

export default RecordAudio;
