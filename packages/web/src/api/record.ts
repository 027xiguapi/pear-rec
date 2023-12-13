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
        url: `/records/delete/${recordId}`,
        method: 'post',
      });
    },
    deleteListRecord: (ids) => {
      return request({
        url: `/records/delete/list`,
        method: 'post',
        data: {
          ids: JSON.stringify(ids),
        },
      });
    },
  };
}
