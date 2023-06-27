import { tradierApi } from './api/tradier';
import { watchlistApi } from './api/watchlists';
import { portfolioApi } from './api/portfolios';
import { portfoliosPage } from './pages/portfolios';
import portfolios from '../fixtures/portfolios.json';
import { PortfolioResponse } from '../../src/types/generated/market-tracker-portfolio-service';

const portfolioList = portfolios as ReadonlyArray<PortfolioResponse>;
const portfolioNames = portfolioList.map((p) => p.name);

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

	it('hides the list of portfolios when there are none', () => {
		tradierApi.getCalendar();
		watchlistApi.getAllWatchlists();
		portfolioApi.getPortfolioList_empty();
		cy.mount();

		cy.wait('@portfolioList_empty');
		portfoliosPage.getPortfoliosPageTitle().should('not.exist');
	});
});
