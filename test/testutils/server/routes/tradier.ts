import { Database } from '../Database';
import { Server } from 'miragejs/server';
import { Response } from 'miragejs';

interface CalendarQuery {
	readonly year: string;
	readonly month: string;
}

export const createTradierRoutes = (database: Database, server: Server) => {
	server.get('/tradier/markets/calendar', (schema, request) => {
		const query = request.queryParams as unknown as CalendarQuery;
		if (!query.year || !query.month) {
			console.error('Missing required fields', query);
			return new Response(400, {}, 'Request Validation Failed');
		}
		return new Response(200, {}, database.data.tradier.calendar);
	});
};
