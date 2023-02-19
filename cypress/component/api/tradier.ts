import Chainable = Cypress.Chainable;
import { format } from 'date-fns/fp';

const formatYear = format('yyyy');
const formatMonth = format('MM');

const getCalendar = (): Chainable<unknown> => {
	const year = formatYear(new Date());
	const month = formatMonth(new Date());
	return cy.intercept(
		`/market-tracker/api/tradier/markets/calendar?year=${year}&month=${month}`,
		{
			fixture: 'calendar.json'
		}
	);
};

export const tradierApi = {
	getCalendar
};
