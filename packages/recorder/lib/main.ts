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

export { audio, video, screen };
export default Media;
