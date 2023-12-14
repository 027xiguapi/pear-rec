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
    getHistory: (type) => {
      return request({
        url: `/getHistory?type=${type}`,
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
