import React, { useState } from "react";

const CutScreen = () => {
	const [previewImage, setPreviewImage] = useState("");

	async function handleCutScreen() {
		window.electronAPI?.openCutScreen();
	}

	function getCutInfo(event: any, pic: any) {
		setPreviewImage(pic);
	}

	return (
		<div className="container">
			<button onClick={handleCutScreen}>截屏</button>
			<div>
				<img src={previewImage} style={{ width: "100%" }} />
			</div>
		</div>
	);
};

export default CutScreen;
