/// <reference no-default-lib="true"/>
/// <reference lib="esnext" />
/// <reference lib="webworker" />
const sw = self as unknown as ServiceWorkerGlobalScope & typeof globalThis;

const CACHE = 'application-cache';
const CACHEABLE_URIS = /^.*\/market-tracker\/(api|portfolios)\/.*$/;

const isCacheableStatus = (response: Response) =>
	response.status >= 200 && response.status <= 300;

sw.addEventListener('install', (event) => {
	event.waitUntil(sw.skipWaiting());
});

sw.addEventListener('activate', (event) => {
	event.waitUntil(sw.clients.claim());
});

sw.addEventListener('fetch', (event) => {
	event.respondWith(
		fetch(event.request)
			.then((response) => {
				if (
					CACHEABLE_URIS.test(event.request.url) &&
					isCacheableStatus(response)
				) {
					return caches
						.open(CACHE)
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
					.open(CACHE)
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
