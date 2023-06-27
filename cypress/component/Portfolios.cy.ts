import { tradierApi } from './api/tradier';
import { watchlistApi } from './api/watchlists';
import { portfolioApi } from './api/portfolios';
import { portfoliosPage } from './pages/portfolios';
import portfolios from '../fixtures/portfolios.json';
import { PortfolioResponse } from '../../src/types/generated/market-tracker-portfolio-service';
import { accordion } from './pages/accordion';

const portfolioList = portfolios as ReadonlyArray<PortfolioResponse>;
const portfolioNames = portfolioList.map((p) => p.name);

const ACCORDION_ID = 'portfolioAccordion';

describe('Portfolios', () => {
	it('shows the list of portfolios', () => {
		tradierApi.getCalendar();
		watchlistApi.getAllWatchlists();
		portfolioApi.getPortfolioList();
		cy.mount();

		portfoliosPage
			.getPortfoliosPageTitle()
			.should('have.text', 'Portfolios');
		portfoliosPage
			.getDownloadDataButton()
			.should('have.text', 'Update Portfolios Now');

		accordion.getPanels(ACCORDION_ID).should('have.length', 3);

		accordion
			.getPanels(ACCORDION_ID)
			.eq(0)
			.then(accordion.getPanelTitle)
			.should('have.text', portfolioNames[0]);

		accordion
			.getPanels(ACCORDION_ID)
			.eq(1)
			.then(accordion.getPanelTitle)
			.should('have.text', portfolioNames[1]);

		accordion
			.getPanels(ACCORDION_ID)
			.eq(2)
			.then(accordion.getPanelTitle)
			.should('have.text', portfolioNames[2]);
	});

	it('hides the list of portfolios when there are none', () => {
		tradierApi.getCalendar();
		watchlistApi.getAllWatchlists();
		portfolioApi.getPortfolioList_empty();
		cy.mount();

		cy.wait('@portfolioList_empty');
		portfoliosPage.getPortfoliosPageTitle().should('not.exist');
		portfoliosPage.getDownloadDataButton().should('not.exist');
	});

	it('can trigger portfolio downloads', () => {
		tradierApi.getCalendar();
		watchlistApi.getAllWatchlists();
		portfolioApi.getPortfolioList();
		cy.mount();

		portfoliosPage
			.getDownloadDataButton()
			.should('have.text', 'Update Portfolios Now');

		portfoliosPage.getDownloadDataButton().click();
		cy.wait('@downloadPortfolioData');
	});
});
