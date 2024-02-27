/**
 * Record audio from the microphone with a real-time waveform preview
 */

import BasePlugin, { type BasePluginEvents } from './base-plugin';

export type RecordPluginOptions = {
  /** The MIME type to use when recording audio */
  mimeType?: MediaRecorderOptions['mimeType'];
  /** The audio bitrate to use when recording audio, defaults to 128000 to avoid a VBR encoding. */
  audioBitsPerSecond?: MediaRecorderOptions['audioBitsPerSecond'];
  /** Whether to render the recorded audio, true by default */
  renderRecordedAudio?: boolean;
};

export type RecordPluginEvents = BasePluginEvents & {
  'record-start': [];
  'record-end': [blob: Blob];
  'record-pause': [];
  'record-resume': [];
};

const DEFAULT_BITS_PER_SECOND = 128000;

const MIME_TYPES = ['audio/webm', 'audio/wav', 'audio/mpeg', 'audio/mp4', 'audio/mp3'];
const findSupportedMimeType = () =>
  MIME_TYPES.find((mimeType) => MediaRecorder.isTypeSupported(mimeType));

class RecordPlugin extends BasePlugin<RecordPluginEvents, RecordPluginOptions> {
  private stream: MediaStream | null = null;
  private mediaRecorder: MediaRecorder | null = null;

  /** Create an instance of the Record plugin */
  constructor(options: RecordPluginOptions) {
    super({
      ...options,
      audioBitsPerSecond: options.audioBitsPerSecond ?? DEFAULT_BITS_PER_SECOND,
    });
  }

  /** Create an instance of the Record plugin */
  public static create(options?: RecordPluginOptions) {
    return new RecordPlugin(options || {});
  }

  private renderMicStream(stream: MediaStream): () => void {
    const audioContext = new AudioContext();
    const source = audioContext.createMediaStreamSource(stream);
    const analyser = audioContext.createAnalyser();
    source.connect(analyser);

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Float32Array(bufferLength);
    const sampleDuration = bufferLength / audioContext.sampleRate;

    let animationId: number;

    const drawWaveform = () => {
      analyser.getFloatTimeDomainData(dataArray);
      if (this.wavesurfer) {
        this.wavesurfer.options.cursorWidth = 0;
        this.wavesurfer.options.interact = false;
        this.wavesurfer.load('', [dataArray], sampleDuration);
      }
      animationId = requestAnimationFrame(drawWaveform);
    };

    drawWaveform();

    return () => {
      cancelAnimationFrame(animationId);
      source?.disconnect();
      audioContext?.close();
    };
  }

  /** Request access to the microphone and start monitoring incoming audio */
  public async startMic(deviceId?: string): Promise<MediaStream> {
    let stream: MediaStream;
    try {
      const constraints =
        deviceId == 'desktop'
          ? {
              audio: {
                mandatory: {
                  chromeMediaSource: 'desktop',
                },
              },
              video: {
                mandatory: {
                  chromeMediaSource: 'desktop',
                },
              },
            }
          : { audio: deviceId ? { deviceId: { exact: deviceId } } : true };
      stream = await navigator.mediaDevices.getUserMedia(constraints as any);
    } catch (err) {
      throw new Error('Error accessing the microphone: ' + (err as Error).message);
    }

    const onDestroy = this.renderMicStream(stream);

    this.subscriptions.push(this.once('destroy', onDestroy));

    this.stream = stream;

    return stream;
  }

  /** Stop monitoring incoming audio */
  public stopMic() {
    if (!this.stream) return;
    this.stream.getTracks().forEach((track) => track.stop());
    this.stream = null;
  }

  /** Start recording audio from the microphone */
  public async startRecording(deviceId?: string) {
    const stream = deviceId ? await this.startMic(deviceId) : this.stream;
    const [audioTrack] = stream.getAudioTracks();
    const mediaRecorder = new MediaRecorder(new MediaStream([audioTrack]), {
      mimeType: this.options.mimeType || findSupportedMimeType(),
      audioBitsPerSecond: this.options.audioBitsPerSecond,
    });
    this.mediaRecorder = mediaRecorder;
    this.stopRecording();

    const recordedChunks: Blob[] = [];

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        recordedChunks.push(event.data);
      }
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(recordedChunks, {
        type: this.options.mimeType || mediaRecorder.mimeType,
      });

      this.emit('record-end', blob);

      if (this.options.renderRecordedAudio !== false) {
        this.wavesurfer?.load(URL.createObjectURL(blob));
      }
    };

    mediaRecorder.onpause = () => {
      this.emit('record-pause');
    };

    mediaRecorder.onresume = () => {
      this.emit('record-resume');
    };

    mediaRecorder.start();

    this.emit('record-start');
  }

  /** Check if the audio is being recorded */
  public isRecording(): boolean {
    return this.mediaRecorder?.state === 'recording';
  }

  public isPaused(): boolean {
    return this.mediaRecorder?.state === 'paused';
  }

  /** Stop the recording */
  public stopRecording(mimeType?: string) {
    if (this.isRecording()) {
      this.options.mimeType = mimeType;
      this.mediaRecorder?.stop();
    }
  }

  /** Pause the recording */
  public pauseRecording() {
    if (this.isRecording()) {
      this.mediaRecorder?.pause();
    }
  }

  /** Resume the recording */
  public resumeRecording() {
    if (this.isPaused()) {
      this.mediaRecorder?.resume();
    }
  }

  /** Destroy the plugin */
  public destroy() {
    super.destroy();
    this.stopRecording();
    this.stopMic();
  }

  /** Get the duration */
  public getDuration(blob): Promise<number> {
    return new Promise((resolve, reject) => {
      const audioContext = new AudioContext();
      const reader = new FileReader();

      reader.onload = function () {
        const arrayBuffer = this.result as ArrayBuffer;
        audioContext.decodeAudioData(
          arrayBuffer,
          (buffer) => {
            const duration = Math.round(buffer.duration * 1000);
            resolve(duration);
          },
          (err) => {
            throw new Error('Error getDuration:' + (err as Error).message);
          },
        );
      };

      if (blob) {
        reader.readAsArrayBuffer(blob);
      } else {
        throw new Error('Error blob is empty ');
      }
    });
  }

  /** Get the devices */
  public getEnumerateDevices(): Promise<MediaDeviceInfo[]> {
    return navigator.mediaDevices.enumerateDevices();
  }

  /** Get the supported mimeTypes */
  public getSupportedMimeTypes(): string[] {
    const media = 'audio';
    const types = [
      'wav',
      'webm',
      'mp4',
      'ogg',
      'mov',
      'avi',
      'wmv',
      'flv',
      'mkv',
      'ts',
      'x-matroska',
      'mpeg',
    ];
    const codecs = ['vp9', 'vp9.0', 'vp8', 'vp8.0', 'avc1', 'av1', 'h265', 'h264'];
    const supportedMimeTypes: string[] = [];
    const isSupported = MediaRecorder.isTypeSupported;
    types.forEach((type: string) => {
      const mimeType = `${media}/${type}`;
      codecs.forEach((codec: string) =>
        [`${mimeType};codecs=${codec}`, `${mimeType};codecs=${codec.toUpperCase()}`].forEach(
          (variation) => {
            if (isSupported(variation)) supportedMimeTypes.push(variation);
          },
        ),
      );
      if (isSupported(mimeType)) supportedMimeTypes.push(mimeType);
    });
    return supportedMimeTypes;
  }
}

export default RecordPlugin;
