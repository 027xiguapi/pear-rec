import request from '../util/request';

export function useUserApi() {
  return {
    getCurrentUser: () => {
      return request({
        url: `/users/current`,
        method: 'get',
      });
    },
  };
}
