import Chainable = Cypress.Chainable;

export const mockGetCalendar = (
	year: string,
	month: string
): Chainable<unknown> =>
	cy.mockGet({
		url: `/tradier/markets/calendar?year=${year}&month=${month}`,
		reply: [200, cy.fixture('calendar.json')]
	});
