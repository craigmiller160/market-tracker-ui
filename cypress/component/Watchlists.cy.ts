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
		watchlistPage.getWatchlistPanels().should('have.length', 3);

		cy.repeat(3, (index) => {
			watchlistPage
				.getWatchlistPanels()
				.eq(index)
				.then(($elem) => {
					watchlistPage
						.getWatchlistPanelTitle($elem)
						.should('have.text', WATCHLIST_NAMES[index]);
					if (index != 1) {
						watchlistPage
							.getWatchlistPanelRenameButton($elem)
							.should('have.text', 'Rename');
						watchlistPage
							.getWatchlistPanelRemoveButton($elem)
							.should('have.text', 'Remove');
					} else {
						watchlistPage
							.getWatchlistPanelRenameButton($elem)
							.should('not.exist');
						watchlistPage
							.getWatchlistPanelRemoveButton($elem)
							.should('not.exist');
					}
				});
		});

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
