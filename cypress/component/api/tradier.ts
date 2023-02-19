import Chainable = Cypress.Chainable;

export const getCalendar = (year: string, month: string): Chainable<unknown> =>
	cy.intercept(`/tradier/markets/calendar?year=${year}&month=${month}`, {
		fixture: 'calendar.json'
	});

export const tradierApi = {
	getCalendar
};
