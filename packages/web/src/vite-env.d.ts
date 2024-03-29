/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/client" />

export {};

declare global {
  interface Window {
    electronAPI: any;
    isElectron: boolean;
    isOffline: boolean;
    isMac: boolean;
    baseURL: string;
    showSaveFilePicker: any;
  }
}

declare module 'react' {
  interface InputHTMLAttributes<T> extends HTMLAttributes<T> {
    // extends React's HTMLAttributes
    directory?: string;
    webkitdirectory?: string;
  }
}
