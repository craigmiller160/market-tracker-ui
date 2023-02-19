import Chainable = Cypress.Chainable;

const getCalendar = (year: string, month: string): Chainable<unknown> =>
	cy.intercept(
		`/market-tracker/api/tradier/markets/calendar?year=${year}&month=${month}`,
		{
			fixture: 'calendar.json'
		}
	);

export const tradierApi = {
	getCalendar
};
