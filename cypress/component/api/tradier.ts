import { format } from 'date-fns/fp';

const formatYear = format('yyyy');
const formatMonth = format('MM');

const getCalendar = () => {
	const year = formatYear(new Date());
	const month = formatMonth(new Date());
	return cy.intercept(
		`/market-tracker/api/tradier/markets/calendar?year=${year}&month=${month}`,
		{
			fixture: 'calendar.json'
		}
	);
};
const getQuote = (symbol: string) =>
	cy
		.intercept(
			`/market-tracker/api/tradier/markets/quotes?symbols=${symbol}`,
			{
				statusCode: 204
			}
		)
		.as(`tradier_getQuote_${symbol}`);

export const tradierApi = {
	getCalendar,
	getQuote
};
