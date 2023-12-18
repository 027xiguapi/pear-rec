import request from '../util/request';

export function useSettingApi() {
  return {
    getSetting: (userId: string) => {
      return request({
        url: `/settings/user/${userId}`,
        method: 'get',
      });
    },
    editSetting: (settingId, data) => {
      return request({
        url: `/settings/edit/${settingId}`,
        method: 'post',
        data: data,
      });
    },
    resetSetting: (settingId) => {
      return request({
        url: `/settings/reset/${settingId}`,
        method: 'post',
      });
    },
  };
}
