import { tradierApi } from './api/tradier';
import { watchlistApi } from './api/watchlists';
import { watchlistPage } from './pages/watchlists';

const WATCHLIST_NAMES = ['ABC', 'Cryptocurrency', 'My Investments'];

describe('Watchlists', () => {
	it('renders all the watchlists on desktop', () => {
		tradierApi.getCalendar();
		watchlistApi.getAllWatchlists();
		cy.mount();

		watchlistPage
			.getPageTitle()
			.should('have.text', 'Investment Watchlists');
		watchlistPage
			.getWatchlistPanels()
			.should('have.length', 3)
			.each(($elem, index) => {
				expect($elem.text()).eq(WATCHLIST_NAMES[index]);
			});

		watchlistPage
			.getWatchlistPanelRenameButton(0)
			.should('have.text', 'Rename');
		watchlistPage.getWatchlistPanelRenameButton(1).should('not.exist');
		watchlistPage
			.getWatchlistPanelRenameButton(2)
			.should('have.text', 'Rename');

		watchlistPage
			.getWatchlistPanelRemoveButton(0)
			.should('have.text', 'Remove');
		watchlistPage.getWatchlistPanelRemoveButton(1).should('not.exist');
		watchlistPage
			.getWatchlistPanelRemoveButton(2)
			.should('have.text', 'Remove');
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
