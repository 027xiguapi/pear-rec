import { Media } from "./lib/media";
import type { AudioOption, VideoOption, ScreenOption } from "./lib/type";

export function audio(option?: AudioOption): Media;

export function video(option?: VideoOption): Media;

export function screen(option?: ScreenOption): Media;

export function desktop(option?: ScreenOption): Media;
