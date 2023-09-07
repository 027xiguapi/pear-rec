---
outline: deep
---

# Timer API Examples

本页是介绍`@pear-rec/timer` 插件的`API`例子

本插件提供了计时器功能。

## 安装

```js
import "@pear-rec/timer";
import "@pear-rec/timer/src/Timer/index.module.scss";
```

## timer 计时器

### 效果展示

<div ref="el" id="root" />

<script setup>
import { createElement } from 'react'
import { createRoot } from 'react-dom/client'
import { ref, onMounted } from 'vue'
import App from './app'

const el = ref()
onMounted(() => {
  const root = createRoot(el.value)
  root.render(createElement(App, {}, null))
})
</script>

<style scoped>
* {
	padding: 0;
	margin: 0;
}

div:deep(.separator) {
	height: 180px;
}
div:deep(.timer) {
  margin: 10px 0;
}
div:deep(.button) {
	margin: 10px;
  display: inline-block;
  border: 1px solid #ccc;
  padding: 5px 10px;
  border-radius: 5px;
  cursor: pointer;
}
</style>

### 完整代码

```js
import { useState } from "react";
import { useStopwatch } from "react-timer-hook";
import Timer from "@pear-rec/timer";
import "@pear-rec/timer/src/Timer/index.module.scss";

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
```
