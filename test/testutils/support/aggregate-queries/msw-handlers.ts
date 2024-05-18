import type {
	TradierCalendar,
	TradierCalendarStatus
} from '../../../../src/types/tradier/calendar';
import {
	type DefaultBodyType,
	http,
	type HttpHandler,
	HttpResponse,
	type PathParams
} from 'msw';
import { format, getMonth, getYear } from 'date-fns';
import type { TradierHistory } from '../../../../src/types/tradier/history';
import { vtiHistory, vtiQuote, vxusHistory, vxusQuote } from './data';
import type {
	TradierQuote,
	TradierQuotes
} from '../../../../src/types/tradier/quotes';
import { server } from '../../msw-server';
import { MarketTime } from '../../../../src/types/MarketTime';

const DATE_FORMAT = 'yyyy-MM-dd';

const createTradierCalendarHandler = (
	status: TradierCalendarStatus
): HttpHandler =>
	http.get(
		'http://localhost:3000/market-tracker/api/tradier/markets/calendar',
		() => {
			const today = new Date();
			const calendar: TradierCalendar = {
				calendar: {
					days: {
						day: [
							{
								date: format(today, DATE_FORMAT),
								status
							}
						]
					},
					month: getMonth(today) + 1,
					year: getYear(today)
				}
			};
			return HttpResponse.json(calendar);
		}
	);

const tradierHistoryHandler: HttpHandler = http.get<
	PathParams,
	DefaultBodyType,
	TradierHistory | string
>(
	'http://localhost:3000/market-tracker/api/tradier/markets/history',
	({ request }) => {
		const url = new URL(request.url);
		const symbol = url.searchParams.get('symbol');
		if (symbol === 'VTI') {
			return HttpResponse.json(vtiHistory);
		}

		if (symbol === 'VXUS') {
			return HttpResponse.json(vxusHistory);
		}

		return HttpResponse.text(`Invalid symbol: ${symbol}`, {
			status: 400
		});
	}
);

const tradierQuoteHandler: HttpHandler = http.get(
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

export const prepareAggregateQueryMswHandlers = (time: MarketTime) =>
	server.server.resetHandlers(
		tradierQuoteHandler,
		tradierHistoryHandler,
		createTradierCalendarHandler(
			time === MarketTime.ONE_DAY ? 'closed' : 'open'
		)
	);
