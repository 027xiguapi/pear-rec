import fs from 'node:fs';
import { join, dirname, extname, basename } from 'node:path';

function getProtocol(isElectron: boolean, type: string) {
  const port = process.env.PORT || 9190;
  const protocol = isElectron ? 'pearrec:///' : `http://localhost:${port}/${type}?url=`;

  return protocol;
}

export function getImgsByImgUrl(imgUrl: string, isElectron: boolean) {
  let imgs: any[] = [];
  let index = 0;
  let currentIndex = 0;
  try {
    const directoryPath = dirname(imgUrl);
    const files = fs.readdirSync(directoryPath); // 读取目录内容
    files.forEach((file) => {
      const filePath = join(directoryPath, file);

      if (isImgFile(filePath)) {
        filePath == imgUrl && (currentIndex = index);
        imgs.push({
          url: `${getProtocol(isElectron, 'getFile')}${filePath}`,
          filePath: filePath,
          index,
        });
        index++;
      }
    });
  } catch (err) {
    console.log('getImgsByImgUrl', err);
  }
  return { imgs, currentIndex };
}

function isImgFile(filePath: string): boolean {
  const ext = extname(filePath).toLowerCase();
  return [
    '.jpg',
    '.jpeg',
    '.jfif',
    '.pjpeg',
    '.pjp',
    '.png',
    'apng',
    '.gif',
    '.bmp',
    '.avif',
    '.webp',
    '.ico',
  ].includes(ext);
}

export function getAudiosByAudioUrl(audioUrl: string, isElectron: boolean) {
  const directoryPath = dirname(audioUrl);
  const files = fs.readdirSync(directoryPath); // 读取目录内容
  let audios: any[] = [];
  let index = 0;
  files.forEach((file) => {
    const filePath = join(directoryPath, file);
    if (isAudioFile(filePath)) {
      const fileName = basename(filePath);
      if (filePath == audioUrl) {
        audios.unshift({
          url: `${getProtocol(isElectron, 'audio')}${filePath}`,
          name: fileName,
          cover: './imgs/music.png',
        });
      } else {
        audios.push({
          url: `${getProtocol(isElectron, 'audio')}${filePath}`,
          name: fileName,
          cover: './imgs/music.png',
        });
      }
      index++;
    }
  });
  return audios;
}

function isAudioFile(filePath: string): boolean {
  const ext = extname(filePath).toLowerCase();
  return [
    '.mp3',
    '.wav',
    '.aac',
    '.ogg',
    '.flac',
    '.aiff',
    '.aif',
    '.m4a',
    '.alac',
    '.ac3',
    '.webm',
  ].includes(ext);
}

export function getVideosByVideoUrl(videoUrl: string, isElectron: boolean) {
  const directoryPath = dirname(videoUrl);
  const files = fs.readdirSync(directoryPath);
  let videos: any[] = [];
  let index = 0;
  let currentIndex = 0;
  files.forEach((file) => {
    const filePath = join(directoryPath, file);
    if (isVideoFile(filePath)) {
      const fileName = basename(filePath);
      filePath == videoUrl && (currentIndex = index);
      videos.push({
        url: `${getProtocol(isElectron, 'video')}${filePath}`,
        index,
        name: fileName,
      });
      index++;
    }
  });
  return { videos, currentIndex };
}

function isVideoFile(filePath: string): boolean {
  const ext = extname(filePath).toLowerCase();
  return ['.mp4', '.mkv', '.avi', '.mov', '.wmv', '.webm'].includes(ext);
}
