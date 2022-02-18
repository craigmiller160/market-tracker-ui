// import { offlineFallback } from 'workbox-recipes';
// import { setDefaultHandler } from 'workbox-routing';
// import { NetworkFirst } from 'workbox-strategies';

export {};

declare const self: ServiceWorkerGlobalScope &
	typeof globalThis & {
		__WB_MANIFEST: any; // eslint-disable-line @typescript-eslint/no-explicit-any
	};

self.__WB_MANIFEST;

// setDefaultHandler(new NetworkFirst());
// offlineFallback();

self.addEventListener('install', () => {
	console.log('Installed');
	self.skipWaiting().then(() => console.log('Skipped Waiting'));
});

self.addEventListener('activate', (event) => {
	console.log('Activated');
	event.waitUntil(
		self.clients.claim().then(() => console.log('Clients claimed'))
	);
});

self.addEventListener('fetch', (event) => {
	console.log('Fetch', event.request);
	return event.respondWith(fetch(event.request));
});
