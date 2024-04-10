import { Notification } from 'electron';
import { ICONx2 } from './constant';

let notification = null;

export function showNotification(options) {
  notification.title = options.title;
  notification.body = options.body;
  notification.show();
}

export function initNotification() {
  notification = new Notification({ icon: ICONx2 });
}
