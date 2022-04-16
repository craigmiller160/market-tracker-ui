import { Database } from '../Database';
import { Server } from 'miragejs/server';
import { Response } from 'miragejs';
import * as Time from '@craigmiller160/ts-functions/es/Time';

interface CalendarQuery {
	readonly year: string;
	readonly month: string;
}

const getTodayYear = () => Time.format('YYYY')(new Date());
const getTodayMonth = () => Time.format('MM')(new Date());

export const createTradierRoutes = (database: Database, server: Server) => {
	server.get('/tradier/markets/calendar', (schema, request) => {
		const query = request.queryParams as unknown as CalendarQuery;
		if (query.year !== getTodayYear()) {
			console.error(
				`Incorrect year param. Expected: ${getTodayYear()} Actual: ${
					query.year
				}`
			);
			return new Response(400, {}, 'Request Validation Failed');
		}
		if (query.month !== getTodayMonth()) {
			console.error(
				`Incorrect month param. Expected: ${getTodayMonth()} Actual: ${
					query.month
				}`
			);
			return new Response(400, {}, 'Request Validation Failed');
		}
		return new Response(200, {}, database.data.tradier.calendar);
	});
};
