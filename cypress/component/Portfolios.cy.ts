import { tradierApi } from './api/tradier';
import { watchlistApi } from './api/watchlists';
import { portfolioApi } from './api/portfolios';
import { portfoliosPage } from './pages/portfolios';

describe('Portfolios', () => {
	it('shows the list of portfolios', () => {
		tradierApi.getCalendar();
		watchlistApi.getAllWatchlists();
		portfolioApi.getPortfolioList();
		cy.mount();

		portfoliosPage
			.getPortfoliosPageTitle()
			.should('have.text', 'Portfolios');
	});
});
