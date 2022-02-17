export {};
console.log('Hello World');

declare const self: ServiceWorkerGlobalScope & typeof globalThis;

// @ts-ignore
self.__WB_MANIFEST;

self.addEventListener('install', () => {
	self.skipWaiting();
});
