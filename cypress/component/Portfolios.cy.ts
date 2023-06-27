import { tradierApi } from './api/tradier';
import { watchlistApi } from './api/watchlists';

describe('Portfolios', () => {
	it('shows the list of portfolios', () => {
		tradierApi.getCalendar();
		watchlistApi.getAllWatchlists();
		cy.mount();
	});
});
