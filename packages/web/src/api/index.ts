import request from '../util/request';

export function useApi() {
  return {
    saveFile: (formData) => {
      return request({
        url: `/file/upload`,
        method: 'post',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        data: formData,
      });
    },
    getFileCache: (type) => {
      return request({
        url: `/file/cache?type=${type}`,
        method: 'get',
      });
    },
    deleteFileCache: (type) => {
      return request({
        url: `/file/cache/delete?type=${type}`,
        method: 'get',
      });
    },
    getFolder: (folderPath) => {
      return request({
        url: `/getFolder?folderPath=${folderPath}`,
        method: 'get',
      });
    },
    openFilePath: (filePath) => {
      return request({
        url: `/openFilePath?filePath=${filePath}`,
        method: 'get',
      });
    },
    getFile: (url) => {
      return request({
        url: `/file?url=${url}`,
        method: 'get',
      });
    },
    getVideoFrames: (filePath) => {
      return request({
        url: `/getVideoFrames?filePath=${filePath}`,
        method: 'get',
      });
    },
    getImgs: (imgUrl) => {
      return request({
        url: `/getImgs?imgUrl=${imgUrl}`,
        method: 'get',
      });
    },
    getAudios: (audioUrl) => {
      return request({
        url: `/getAudios?audioUrl=${audioUrl}`,
        method: 'get',
      });
    },
    getVideos: (videoUrl) => {
      return request({
        url: `/getVideos?videoUrl=${videoUrl}`,
        method: 'get',
      });
    },
  };
}
