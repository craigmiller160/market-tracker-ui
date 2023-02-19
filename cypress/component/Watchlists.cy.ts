import { tradierApi } from './api/tradier';
import { watchlistApi } from './api/watchlists';
import { watchlistPage } from './pages/watchlists';
import { accordionPage } from './pages/accordion';

const WATCHLIST_NAMES = ['ABC', 'Cryptocurrency', 'My Investments'];

describe('Watchlists', () => {
	it('renders all the watchlists on desktop', () => {
		tradierApi.getCalendar();
		watchlistApi.getAllWatchlists();
		tradierApi.getQuote('GHI');
		tradierApi.getQuote('DEF');
		tradierApi.getQuote('VTI');
		tradierApi.getQuote('VXUS');
		cy.mount();

		watchlistPage
			.getPageTitle()
			.should('have.text', 'Investment Watchlists');
		accordionPage.getPanels().should('have.length', 3);

		cy.repeat(3, (index) => {
			accordionPage
				.getPanels()
				.eq(index)
				.then(($elem) => {
					accordionPage
						.getPanelTitle($elem)
						.should('have.text', WATCHLIST_NAMES[index]);
					if (index != 1) {
						accordionPage
							.getPanelRenameButton($elem)
							.should('have.text', 'Rename');
						accordionPage
							.getPanelRemoveButton($elem)
							.should('have.text', 'Remove');
					} else {
						accordionPage
							.getPanelRenameButton($elem)
							.should('not.exist');
						accordionPage
							.getPanelRemoveButton($elem)
							.should('not.exist');
					}
				});
		});

		accordionPage.getPanels().eq(0).click();
		accordionPage.getPanelBody(0).should('be.visible');
		watchlistPage.getInvestmentCards().should('have.length', 2);

		// Remove investment from watchlist, except crypto
	});

	it('renders all the watchlists on mobile', () => {
		tradierApi.getCalendar();
		watchlistApi.getAllWatchlists();
		cy.mount({
			viewport: 'mobile'
		});
		// Remove investment from watchlist, except crypto
		throw new Error();
	});
});
