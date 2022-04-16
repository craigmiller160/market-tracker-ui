import { Database } from '../Database';
import { Server } from 'miragejs/server';
import { Response } from 'miragejs';
import * as Time from '@craigmiller160/ts-functions/es/Time';

interface CalendarQuery {
	readonly year: string;
	readonly month: string;
}

interface TimesaleQuery {
	readonly symbol: string;
	readonly start: string;
	readonly end: string;
}

interface QuoteQuery {
	readonly symbols: string;
}

interface HistoryQuery {
	readonly symbol: string;
	readonly start: string;
	readonly end: string;
	readonly interval: string;
}

const getTodayYear = () => Time.format('yyyy')(new Date());
const getTodayMonth = () => Time.format('MM')(new Date());

const validationError = (message: string): Response => {
	console.error(message);
	return new Response(400, {}, 'Request Validation Failed');
};

export const createTradierRoutes = (database: Database, server: Server) => {
	server.get('/tradier/markets/calendar', (schema, request) => {
		const query = request.queryParams as unknown as CalendarQuery;
		if (query.year !== getTodayYear()) {
			return validationError(
				`Incorrect year param. Expected: ${getTodayYear()} Actual: ${
					query.year
				}`
			);
		}
		if (query.month !== getTodayMonth()) {
			return validationError(
				`Incorrect month param. Expected: ${getTodayMonth()} Actual: ${
					query.month
				}`
			);
		}
		return new Response(200, {}, database.data.tradier.calendar);
	});

	server.get('/tradier/markets/timesales', (schema, request) => {
		const query = request.queryParams as unknown as TimesaleQuery;
		if (!query.start) {
			return validationError(`Missing start param`);
		}
		if (!query.end) {
			return validationError('Missing end param');
		}
		const timesale = database.data.tradier.timesales[query.symbol];
		if (!timesale) {
			return validationError(`No timesale for symbol: ${query.symbol}`);
		}
		return timesale;
	});

	server.get('/tradier/markets/quotes', (schema, request) => {
		const query = request.queryParams as unknown as QuoteQuery;
		const quote = database.data.tradier.timesales[query.symbols];
		if (!quote) {
			return validationError(`No quote for symbol: ${query.symbols}`);
		}
		return quote;
	});

	server.get('/tradier/markets/history', (schema, request) => {
		const query = request.queryParams as unknown as HistoryQuery;
		if (!query.start) {
			return validationError('Missing start param');
		}
		if (!query.end) {
			return validationError('Missing end param');
		}
		if (!query.interval) {
			return validationError('Missing interval param');
		}
		const history = database.data.tradier.history[query.symbol];
		if (!history) {
			return validationError(`No history for symbol: ${query.symbol}`);
		}
		return history;
	});
};
