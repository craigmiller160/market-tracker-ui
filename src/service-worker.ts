export {};

declare const self: ServiceWorkerGlobalScope &
	typeof globalThis & {
		__WB_MANIFEST: any; // eslint-disable-line @typescript-eslint/no-explicit-any
	};

self.__WB_MANIFEST;
const MARKET_DATA_CACHE = 'market-data-cache';
const MARKET_DATA_REGEX = /^.*\/api\/(tradier|coingecko)\/.*$/;

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
	if (MARKET_DATA_REGEX.test(event.request.url)) {
		console.log('MarketData 2', event.request.url);
		// return event.respondWith(
		// 	caches.open(MARKET_DATA_CACHE).then((cache) => {
		// 		return cache.match(event.request).then((response) => {
		// 			return (
		// 				response ||
		// 				fetch(event.request).then((response2) => {
		// 					cache.put(event.request, response2.clone());
		// 					return response2;
		// 				})
		// 			);
		// 		});
		// 	})
		// );
	}
	return event.respondWith(fetch(event.request));
});
