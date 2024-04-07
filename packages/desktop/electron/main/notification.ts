import { Notification } from 'electron';
import { ICON } from './constant';

export function showNotification(_options) {
  const options = { icon: ICON, ..._options };
  new Notification(options).show();
}
