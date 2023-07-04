import type { FC } from "react";
import { lazy, Suspense } from "react";
import { Skeleton } from "antd";
import { Routes, Route, HashRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "@/stores";

// import Home from "@/pages/home";
// import ShotScreen from "@/pages/shotScreen";
// import RecorderScreen from "@/pages/recorderScreen";
// import RecordVideo from "@/pages/recorderVideo";
// import RecordAudio from "@/pages/recorderAudio";
// import ViewImage from "@/pages/viewImage";
// import ViewVideo from "@/pages/viewVideo";
// import Setting from "@/pages/setting";

const Home = lazy(() => import("@/pages/home"));
const ShotScreen = lazy(() => import("@/pages/shotScreen"));
const RecorderScreen = lazy(() => import("@/pages/recorderScreen"));
const RecordVideo = lazy(() => import("@/pages/recorderVideo"));
const RecordAudio = lazy(() => import("@/pages/recorderAudio"));
const ViewImage = lazy(() => import("@/pages/viewImage"));
const ViewVideo = lazy(() => import("@/pages/viewVideo"));
const Setting = lazy(() => import("@/pages/setting"));
const ClipScreen = lazy(() => import("@/pages/clipScreen"));

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
					<Route path="/clipScreen" element={<ClipScreen />}></Route>
				</Routes>
			</Suspense>
		</Provider>
	</HashRouter>
);

export default App;
