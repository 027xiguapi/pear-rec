import React, { useImperativeHandle, useRef, forwardRef } from "react";
import { useTranslation } from "react-i18next";
import { Space, Button } from "antd";

function UploadImg(props) {
	const { t } = useTranslation();
	const inputRef = useRef(null);

	function handleUpload() {
		inputRef.current.click();
	}

	function handleUploadImg(event) {
		const files = event.target.files;
		props.handleUploadImg(files);
	}

	return (
		<Space>
			<Button type="primary" onClick={handleUpload}>
				图片
			</Button>
			<input
				type="file"
				accept="image/png,image/jpeg,.webp"
				className="inputRef hide"
				ref={inputRef}
				onChange={handleUploadImg}
			/>
		</Space>
	);
}

export default UploadImg;
