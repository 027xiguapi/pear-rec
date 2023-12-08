import { createRoot } from 'react-dom/client';
import { initI18n } from '../i18n';
import './index.scss';

export default function initApp(App) {
  const userAgent = navigator.userAgent.toLowerCase();
  window.isElectron = userAgent.indexOf(' electron/') > -1 ? true : false;
  window.isOffline = location.host == 'pear-rec-xiguapi.vercel.app' ? true : false;
  window.baseURL = import.meta.env.VITE_API_URL;
  const container = document.getElementById('root') as HTMLElement;
  const root = createRoot(container);
  initI18n();
  root.render(<App />);
}
