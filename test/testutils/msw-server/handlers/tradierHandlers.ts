import type { Database } from '../Database';
import {
	DefaultBodyType,
	http,
	HttpHandler,
	HttpResponse,
	type PathParams
} from 'msw';
import * as Time from '@craigmiller160/ts-functions/Time';
import { validationError } from '../../server/utils/validate';

const getTodayYear = () => Time.format('yyyy')(new Date());
const getTodayMonth = () => Time.format('MM')(new Date());

export const createTradierHandlers = (
	database: Database
): ReadonlyArray<HttpHandler> => {
	const getCalendarHandler = http.get<PathParams, DefaultBodyType>(
		'http://localhost/market-tracker/api/tradier/markets/calendar',
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
	return [getCalendarHandler];
};
