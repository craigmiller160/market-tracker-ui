import { tradierApi } from './api/tradier';
import { watchlistApi } from './api/watchlists';
import { watchlistPage } from './pages/watchlists';
import { accordion } from './pages/accordion';
import { investments } from './pages/investments';

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
		accordion.getPanels().should('have.length', 3);

		cy.repeat(3, (index) => {
			accordion
				.getPanels()
				.eq(index)
				.then(($elem) => {
					accordion
						.getPanelTitle($elem)
						.should('have.text', WATCHLIST_NAMES[index]);
					if (index != 1) {
						accordion
							.getPanelRenameButton($elem)
							.should('have.text', 'Rename');
						accordion
							.getPanelRemoveButton($elem)
							.should('have.text', 'Remove');
					} else {
						accordion
							.getPanelRenameButton($elem)
							.should('not.exist');
						accordion
							.getPanelRemoveButton($elem)
							.should('not.exist');
					}
				});
		});

		accordion.getPanels().eq(0).click();
		accordion.getPanelBody(0).should('be.visible');
		investments.getCards().should('have.length', 2);
		investments
			.getCardActions(0)
			.should('have.length', 1)
			.should('have.text', 'Remove');

		accordion.getPanels().eq(1).click();
		accordion.getPanelBody(1).should('be.visible');
		investments.getCards().should('have.length', 2);
		investments.getCardActions(0).should('not.exist');
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
