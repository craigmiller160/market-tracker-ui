import { test } from 'vitest';
import { server } from '../testutils/msw-server';
import type {
	TradierQuote,
	TradierQuotes
} from '../../src/types/tradier/quotes';
import { http, type HttpHandler, HttpResponse } from 'msw';

const vtiQuote: TradierQuote = {
	symbol: 'VTI',
	description: '',
	ask: 0,
	bid: 0,
	close: 0,
	high: 0,
	last: 262.3,
	low: 0,
	open: 0,
	prevclose: 261.93
};

const vxusQuote: TradierQuote = {
	symbol: 'VXUS',
	description: '',
	ask: 0,
	bid: 0,
	close: 0,
	high: 0,
	last: 62.21,
	low: 0,
	open: 0,
	prevclose: 61.94
};

const tradierHandler: HttpHandler = http.get(
	'http://localhost:3000/market-tracker/api/tradier/markets/quotes',
	({ request }) => {
		const url = new URL(request.url);
		const symbols = url.searchParams.get('symbols')?.split(',') ?? [];
		const quotes = [
			symbols.includes('VTI') ? vtiQuote : undefined,
			symbols.includes('VXUS') ? vxusQuote : undefined
		].filter((quote): quote is TradierQuote => !!quote);

		if (quotes.length === 0) {
			return HttpResponse.json<TradierQuotes>({
				quotes: {
					quote: undefined,
					unmatched_symbols: undefined
				}
			});
		}

		if (quotes.length === 0) {
			return HttpResponse.json<TradierQuotes>({
				quotes: {
					quote: quotes[0],
					unmatched_symbols: undefined
				}
			});
		}

		return HttpResponse.json<TradierQuotes>({
			quotes: {
				quote: quotes,
				unmatched_symbols: undefined
			}
		});
	}
);

beforeEach(() => {
	server.server.resetHandlers();
});

test.fails('validates useGetAggregateInvestmentData');
