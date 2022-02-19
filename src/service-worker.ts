export {};

declare const self: ServiceWorkerGlobalScope &
	typeof globalThis & {
		__WB_MANIFEST: any; // eslint-disable-line @typescript-eslint/no-explicit-any
	};

self.__WB_MANIFEST;
const MARKET_DATA_CACHE = 'market-data-cache';
const MARKET_DATA_REGEX = /^.*\/api\/(tradier|coingecko)\/.*$/;

self.addEventListener('install', (event) => {
	event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', (event) => {
	event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
	event.respondWith(
		fetch(event.request)
			.then((response) => {
				if (MARKET_DATA_REGEX.test(event.request.url)) {
					console.log('Response', response);
				}
				return response;
			})
			.catch((ex) => {
				console.log(
					'WorkerError',
					ex.message,
					Object.keys(ex),
					navigator.onLine
				);
				const init = { status: 500, statusText: 'offline' };
				return new Response('', init);
			})
	);
});
