/// <reference types="vite/client" />

export {};

declare global {
	interface Window {
		electronAPI: any;
	}
}
