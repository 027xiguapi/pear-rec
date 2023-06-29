// 录音、录像、录屏
type MediaType = "audio" | "video" | "screen" | "desktop";

type MediaState = "inactive" | "wait" | "ready";

/**
 * 录音参数
 * mimeType 保存数据格式
 * audioBitsPerSecond 比特率
 * sampleRate 采样率
 * timeSlice 间隔时间(ms)
 * echoCancellation 回声处理
 */
interface AudioOption {
	audio?: boolean | MediaTrackConstraints;
	mimeType?: string;
	audioBitsPerSecond?: number;
	sampleRate?: number;
	timeSlice?: number;
	echoCancellation?: boolean;
	blobType?: string;
}

// pan: 平移, tilt: 倾斜, zoom: 缩放
interface VideoOption extends AudioOption {
	video?: boolean | MediaTrackConstraints;
	videoBitsPerSecond?: number;
	width?: number;
	height?: number;
	pan?: boolean;
	tilt?: boolean;
	zoom?: boolean;
}

interface ScreenOption extends VideoOption {}

export type { MediaType, MediaState, AudioOption, VideoOption, ScreenOption };
