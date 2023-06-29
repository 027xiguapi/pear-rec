import { audio, video, screen } from "./index";
import { Env } from "./env";
import { _enumerateDevices, getSupportedMimeTypes } from "./utils";
import { version } from "../package.json";

(<any>window).mediajs = {
	audio,
	video,
	screen,
	Env,
	version,
	getDevices: _enumerateDevices,
	getSupportedMimeTypes,
};
/** @deprecated Should use mediajs namespace */
