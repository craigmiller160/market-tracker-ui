import { http, type HttpHandler, HttpResponse } from 'msw';

export const createPortfolioHandlers = (): ReadonlyArray<HttpHandler> => {
	const getAllPortfoliosHandler = http.get(
		'http://localhost/market-tracker/portfolios/portfolios',
		() => HttpResponse.json([])
	);
	return [getAllPortfoliosHandler];
};
