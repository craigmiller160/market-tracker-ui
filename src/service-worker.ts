export {};

declare const self: ServiceWorkerGlobalScope;

const MARKET_DATA_CACHE = 'market-data-cache';
const MARKET_DATA_REGEX = /^.*\/api\/(tradier|coingecko)\/.*$/;

const isCacheableStatus = (response: Response): boolean =>
	response.status >= 200 && response.status <= 300;

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
				if (
					MARKET_DATA_REGEX.test(event.request.url) &&
					isCacheableStatus(response)
				) {
					return caches
						.open(MARKET_DATA_CACHE)
						.then((cache) =>
							cache.put(event.request, response.clone())
						)
						.then(() => response);
				}
				return response;
			})
			.catch((ex) => {
				console.error('Critical Error', ex);
				return caches
					.open(MARKET_DATA_CACHE)
					.then((cache) => cache.match(event.request))
					.then(
						(response) =>
							response ??
							new Response(`Critical Error: ${ex.message}`, {
								status: 500,
								statusText: 'Critical Error'
							})
					);
			})
	);
});
