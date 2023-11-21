import request from '../util/request';

export function useRecordApi() {
  return {
    getRecords: (data: any) => {
      return request({
        url: `/records?pageSize=${data.pageSize}&pageNumber=${data.pageNumber}`,
        method: 'get',
      });
    },
    deleteRecord: (recordId) => {
      return request({
        url: `/deleteRecord/${recordId}`,
        method: 'post',
      });
    },
    deleteAllRecord: () => {
      return request({
        url: `/deleteAllRecord`,
        method: 'post',
      });
    },
  };
}
