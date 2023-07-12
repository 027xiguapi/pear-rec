---
outline: deep
---

# Screenshot API Examples

本页是介绍`@pear-rec/screenshot` 插件的`API`例子

本插件提供了计时器功能。

## 安装

```js
import "@pear-rec/screenshot";
import "@pear-rec/screenshot/lib/style.css";
```

## timer 计时器

### 效果展示

在线示例：<a href="/pear-rec/screenshot/default.html" target="_blank"> DEMO </a>

- https://027xiguapi.github.io/pear-rec/screenshot/default.html

<center>
  <img src="/imgs/screenshot.jpg"/>
</center>

### 完整代码

```js
import React, { ReactElement, useCallback } from "react";
import Screenshots from "@pear-rec/screenshot";
import "@pear-rec/screenshot/lib/style.css";
import "./app.scss";
import imageUrl from "/imgs/th.webp";

export default function App() {
	const onSave = useCallback((blob, bounds) => {
		console.log("save", blob, bounds);
		if (blob) {
			const url = URL.createObjectURL(blob);
			console.log(url);
			window.open(url);
		}
	}, []);
	const onCancel = useCallback(() => {
		console.log("cancel");
	}, []);
	const onOk = useCallback((blob, bounds) => {
		console.log("ok", blob, bounds);
		if (blob) {
			const url = URL.createObjectURL(blob);
			console.log(url);
			window.open(url);
		}
	}, []);

	return (
		<div className="body">
			<Screenshots
				url={imageUrl}
				width={window.innerWidth}
				height={window.innerHeight}
				lang={{
					operation_rectangle_title: "Rectangle",
				}}
				onSave={onSave}
				onCancel={onCancel}
				onOk={onOk}
			/>
		</div>
	);
}
```
