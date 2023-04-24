import type { FC } from "react";
import { Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "@/stores";
import "./index.scss";

import Home from "renderer/pages/home";
import CutScreen from "renderer/pages/cutScreen";
import RecordScreen from "renderer/pages/recorderScreen";
import RecordVideo from "renderer/pages/recorderVideo";
import RecordAudio from "renderer/pages/recorderAudio";

const App: FC = () => (
  <Provider store={store}>
    <div className="app">
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/cutScreen" element={<CutScreen />}></Route>
        <Route path="/recordScreen" element={<RecordScreen />}></Route>
        <Route path="/recordVideo" element={<RecordVideo />}></Route>
        <Route path="/recordAudio" element={<RecordAudio />}></Route>
      </Routes>
    </div>
  </Provider>
);

export default App;
