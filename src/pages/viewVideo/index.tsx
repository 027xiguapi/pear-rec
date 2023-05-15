import React, { useEffect } from "react";
import Plyr from "plyr";
import "plyr/dist/plyr.css";
import source from "@/assets/video/frag_bunny.mp4";
import poster from "@/assets/imgs/logo.png";
import "./index.scss";

const ViewVideo = () => {
	useEffect(() => {
		const player = new Plyr("#player");
		console.log("ViewVideo", Plyr);
	}, []);
	return (
		<div className="viewVideo">
			<video id="player" playsInline controls>
				<source src={source} type="video/mp4" />
			</video>
		</div>
	);
};

export default ViewVideo;
