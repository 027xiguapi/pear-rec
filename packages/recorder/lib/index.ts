import { Media } from "./media";
import type { AudioOption, VideoOption, ScreenOption } from "./type";

function audio(option?: AudioOption) {
	const audio = new Media("audio", option);
	return audio;
}

function video(option?: VideoOption) {
	const video = new Media("video", option);
	return video;
}

function screen(option?: ScreenOption) {
	const screen = new Media("screen", option);
	return screen;
}

function desktop(option?: ScreenOption) {
	const desktop = new Media("desktop", option);
	return desktop;
}

export { audio, video, screen, desktop };
export default Media;
