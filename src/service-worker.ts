
/// <reference lib="ES2015" />
/// <reference lib="webworker" />

export {};

declare const self: ServiceWorkerGlobalScope;

self.addEventListener('install', (event) => {
	self.skipWaiting();
});
