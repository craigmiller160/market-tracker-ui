import type { Database } from '../Database';
import {
	type DefaultBodyType,
	http,
	HttpHandler,
	HttpResponse,
	type PathParams,
	type StrictResponse
} from 'msw';
import * as Time from '@craigmiller160/ts-functions/Time';
import { validationError } from '../utils/validate';
import type { TradierSeries } from '../../../../src/types/tradier/timesales';
import type { TradierQuotes } from '../../../../src/types/tradier/quotes';
import type { TradierHistory } from '../../../../src/types/tradier/history';

const getTodayYear = () => Time.format('yyyy')(new Date());
const getTodayMonth = () => Time.format('MM')(new Date());

export const createTradierHandlers = (
	database: Database
): ReadonlyArray<HttpHandler> => {
	const getCalendarHandler = http.get<PathParams, DefaultBodyType>(
		'http://localhost:3000/market-tracker/api/tradier/markets/calendar',
		({ request }) => {
			const queryParams = new URL(request.url).searchParams;
			const year = queryParams.get('year');
			const month = queryParams.get('month');

			if (year !== getTodayYear()) {
				return validationError(
					`Incorrect year param. Expected: ${getTodayYear()} Actual: ${year}`
				);
			}
			if (month !== getTodayMonth()) {
				return validationError(
					`Incorrect month param. Expected: ${getTodayMonth()} Actual: ${month}`
				);
			}
			HttpResponse.json(database.data.tradier.calendar);
		}
	);

	const getTimesalesHandler = http.get(
		'http://localhost:3000/market-tracker/api/tradier/markets/timesales',
		({ request }): StrictResponse<TradierSeries | string> => {
			const queryParams = new URL(request.url).searchParams;
			const start = queryParams.get('start');
			const end = queryParams.get('end');
			const symbol = queryParams.get('symbol');
			if (!start) {
				return validationError(`Missing start param`);
			}
			if (!end) {
				return validationError('Missing end param');
			}
			if (!symbol) {
				return validationError('Missing symbol param');
			}
			const timesale = database.data.tradier.timesales[symbol];
			if (!timesale) {
				return validationError(`No timesale for symbol: ${symbol}`);
			}
			return HttpResponse.json(timesale);
		}
	);

	const getQuotesHandler = http.get(
		'http://localhost:3000/market-tracker/api/tradier/markets/quotas',
		({ request }): StrictResponse<TradierQuotes | string> => {
			const queryParams = new URL(request.url).searchParams;
			const symbols = queryParams.get('symbols');
			if (!symbols) {
				return validationError('Missing symbols param');
			}

			const quote = database.data.tradier.quotes[symbols];
			if (!quote) {
				return validationError(`No quote for symbol: ${symbols}`);
			}
			return HttpResponse.json(quote);
		}
	);

	const getHistoryHandler = http.get(
		'http://localhost:3000/market-tracker/api/tradier/markets/history',
		({ request }): StrictResponse<TradierHistory | string> => {
			const queryParams = new URL(request.url).searchParams;
			const start = queryParams.get('start');
			const end = queryParams.get('end');
			const symbol = queryParams.get('symbol');
			const interval = queryParams.get('interval');
			if (!start) {
				return validationError(`Missing start param`);
			}
			if (!end) {
				return validationError('Missing end param');
			}
			if (!symbol) {
				return validationError('Missing symbol param');
			}
			if (!interval) {
				return validationError('Missing interval param');
			}

			const history = database.data.tradier.history[symbol];
			if (!history) {
				return validationError(`No history for symbol: ${symbol}`);
			}
			return HttpResponse.json(history);
		}
	);
	return [
		getCalendarHandler,
		getTimesalesHandler,
		getQuotesHandler,
		getHistoryHandler
	];
};
