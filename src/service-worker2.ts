export {};

// declare const self: ServiceWorkerGlobalScope;
declare const self: ServiceWorkerGlobalScope & typeof globalThis;

self.addEventListener('install', () => {
	self.skipWaiting();
});
