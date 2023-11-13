import request from '../util/request';

export function useApi() {
  return {
    saveFile: (formData) => {
      return request({
        url: `/saveFile`,
        method: 'post',
        data: formData,
      });
    },
    getFile: (url) => {
      return request({
        url: `/getFile?url=${url}`,
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
