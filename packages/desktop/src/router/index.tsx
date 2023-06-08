import type { FC } from "react";
import { lazy, Suspense } from "react";
import { Skeleton } from "antd";
import { Routes, Route, HashRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "@/stores";

const Home = lazy(() => import("@/pages/home"));
const ShotScreen = lazy(() => import("@/pages/shotScreen"));
const RecorderScreen = lazy(() => import("@/pages/recorderScreen"));
const RecordVideo = lazy(() => import("@/pages/recorderVideo"));
const RecordAudio = lazy(() => import("@/pages/recorderAudio"));
const ViewImage = lazy(() => import("@/pages/viewImage"));
const ViewVideo = lazy(() => import("@/pages/viewVideo"));
const Setting = lazy(() => import("@/pages/setting"));

const App: FC = () => (
	<HashRouter>
		<Provider store={store}>
			<Suspense fallback={<Skeleton active />}>
				<Routes>
					<Route path="/" element={<Home />}></Route>
					<Route path="/home" element={<Home />}></Route>
					<Route path="/shotScreen" element={<ShotScreen />}></Route>
					<Route path="/RecorderScreen" element={<RecorderScreen />}></Route>
					<Route path="/recorderVideo" element={<RecordVideo />}></Route>
					<Route path="/recorderAudio" element={<RecordAudio />}></Route>
					<Route path="/viewImage" element={<ViewImage />}></Route>
					<Route path="/viewVideo" element={<ViewVideo />}></Route>
					<Route path="/setting" element={<Setting />}></Route>
				</Routes>
			</Suspense>
		</Provider>
	</HashRouter>
);

export default App;
