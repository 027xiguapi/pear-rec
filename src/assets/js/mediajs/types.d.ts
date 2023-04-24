type EventType = "error" | "create" | "destroy" | "start" | "stop" | "pause" | "resume" | "dataavailable";
declare class EventTarget {
    on(name: EventType, callback: Function): void;
    emit(name: EventType, ...args: Array<any>): void;
    off(name: EventType, fn: Function): void;
    once(name: EventType, fn: Function): void;
}
declare class SoundMeter {
    constructor(context: AudioContext);
    getInstant(): number;
    getSlow(): number;
    getClip(): number;
    connectToSource(stream: MediaStream): void;
    stop(): void;
}
type MediaType = "audio" | "video" | "screen";
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
}
interface VideoOption extends AudioOption {
    video?: boolean | MediaTrackConstraints;
    videoBitsPerSecond?: number;
    width?: number;
    height?: number;
    pan?: boolean;
    tilt?: boolean;
    zoom?: boolean;
}
interface ScreenOption extends VideoOption {
}
declare class Media extends EventTarget {
    constructor(mediaType: MediaType, option?: AudioOption | VideoOption | ScreenOption);
    setConfig(option?: AudioOption | VideoOption | ScreenOption): this;
    getAudioConstraints(option: any): any;
    getVideoConstraints(option: any): any;
    getConfigOptions(option: any): {
        mimeType: any;
    };
    setAudioConfig(option: AudioOption): this;
    setVideoConfig(option: VideoOption): this;
    setScreenConfig(option: ScreenOption): this;
    setTimeSlice(timeSlice: number): this;
    getTimeSlice(): number;
    getMediaType(): MediaType;
    /**
     *
     * @param setMediaType
     * audio: 录音 Boolean;
        video: 录像 Boolean;
        screen: 录屏 Boolean;
     * @returns
     */
    setMediaType(mediaType: MediaType): this;
    getMedisStream(): MediaStream | null;
    setMediaStream(constraints?: MediaStreamConstraints): Promise<this>;
    getMediaRecorder(): MediaRecorder | null;
    setMediaRecorder(options?: MediaRecorderOptions): this;
    getMediaBlobs(): Blob[];
    getMediaState(): MediaState;
    getRecorderState(): string;
    getMediaStreamConstraints(): MediaStreamConstraints | null;
    /**
     *
     * @param constraints
     * audio：指定是否获取音频流。
        video：指定是否获取视频流。
        audioConstraints 和 videoConstraints：分别指定音频和视频的约束条件，例如采样率、帧速率等。
        facingMode：指定使用前置或后置摄像头。
        width 和 height：指定视频的宽度和高度。
        frameRate：指定视频的帧速率。
        deviceId：指定要使用的音频或视频设备的 ID。
     * @returns
     */
    setMediaStreamConstraints(constraints?: MediaStreamConstraints): this;
    getMediaRecorderOptions(): MediaRecorderOptions | null;
    /**
     *
     * @param options
     * mimeType：指定录制的媒体文件类型，例如 audio/webm、video/webm 等。
        audioBitsPerSecond 和 videoBitsPerSecond：分别指定音频和视频的比特率。
        audioChannels：指定使用的音频通道数。
        videoFrameRate：指定视频的帧速率。
        width 和 height：指定视频的宽度和高度。
        videoSize：指定视频的大小，可以是宽度和高度组成的对象，也可以是字符串（例如“640x480”）。
        echoCancellation：指定是否启用回声消除。
     * @returns
     */
    setMediaRecorderOptions(options?: MediaRecorderOptions): this;
    isReady(type?: string): boolean;
    onerror(callback?: Function): this;
    create(): Promise<this>;
    oncreate(callback?: Function): this;
    destroy(): this;
    ondestroy(callback?: Function): this;
    ondataavailable(callback?: Function): this;
    start(timeSlice?: number): this;
    onstart(callback?: Function): void;
    stop(): this;
    onstop(callback?: Function): this;
    pause(): this;
    onpause(callback?: Function): this;
    resume(): this;
    onresume(callback?: Function): this;
    setSoundMeter(mediaStream?: MediaStream): this;
    getSoundMeter(): SoundMeter;
    getBlob(options?: BlobPropertyBag): Blob;
    getBlobUrl(options?: BlobPropertyBag): string;
    downloadBlob(filename: any): this;
    getDuration(blob?: Blob): Promise<number>;
    _enumerateDevices(): Promise<MediaDeviceInfo[]>;
    getSupportedMimeTypes(): string[];
    _isTypeSupported(mimeType: string): boolean;
    getVideoTracks(stream?: MediaStream): MediaStreamTrack[];
    connectVideo(video: HTMLVideoElement): this;
    connectAudio(audio: HTMLAudioElement): this;
    snapshot(canvas: HTMLCanvasElement, video: HTMLVideoElement): this;
}
export function audio(option?: AudioOption): Media;
export function video(option?: VideoOption): Media;
export function screen(option?: ScreenOption): Media;
export default Media;

//# sourceMappingURL=types.d.ts.map
