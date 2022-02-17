import { offlineFallback } from 'workbox-recipes';
import { setDefaultHandler } from 'workbox-routing';
import { NetworkFirst } from 'workbox-strategies';

declare const self: ServiceWorkerGlobalScope &
	typeof globalThis & {
		__WB_MANIFEST: any; // eslint-disable-line @typescript-eslint/no-explicit-any
	};

self.__WB_MANIFEST;

setDefaultHandler(new NetworkFirst());
offlineFallback();

// self.addEventListener('install', () => {
// 	console.log('Installed')
// 	self.skipWaiting()
// 		.then(() => console.log('Skipped Waiting'));
// });
