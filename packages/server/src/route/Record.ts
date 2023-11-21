import { RecordController } from '../controller/RecordController';

const recordController = new RecordController();

export const RecordRoutes = [
  {
    path: '/records',
    method: 'get',
    action: recordController.getRecords,
  },
  {
    path: '/addRecord',
    method: 'post',
    action: recordController.createRecord,
  },
  {
    path: '/record/:id',
    method: 'get',
    action: recordController.getRecord,
  },
  {
    path: '/editRecord/:id',
    method: 'post',
    action: recordController.updateRecord,
  },
  {
    path: '/deleteRecord/:id',
    method: 'post',
    action: recordController.deleteRecord,
  },
  {
    path: '/deleteAllRecord',
    method: 'post',
    action: recordController.deleteAllRecord,
  },
];
