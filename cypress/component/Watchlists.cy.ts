import { tradierApi } from './api/tradier';
import { watchlistApi } from './api/watchlists';
import { watchlistPage } from './pages/watchlists';
import { accordion } from './pages/accordion';
import { investments } from './pages/investments';
import { navbarPage } from './pages/navbar';
import { coinGeckoApi } from './api/coingecko';
import { confirmDialog } from './pages/confirmDialog';

const WATCHLIST_NAMES = ['ABC', 'Cryptocurrency', 'My Investments'];

describe('Watchlists', () => {
	it('removes stock from watchlist', () => {
		tradierApi.getCalendar();
		watchlistApi.getAllWatchlists();
		watchlistApi.getWatchlistNames();
		tradierApi.getStockData('GHI', '1week');
		tradierApi.getStockData('DEF', '1week');
		watchlistApi.removeStockFromWatchlist('DEF', 'ABC');
		cy.mount();

		watchlistPage
			.getPageTitle()
			.should('have.text', 'Investment Watchlists');
		accordion.getPanels().should('have.length', 3);

		navbarPage.desktop.getOneWeekItem().click();

		accordion.getPanels().eq(0).click();
		investments.getCards().should('have.length', 2);

		investments.getRemoveButton(0).click();
		confirmDialog.getTitle().should('have.text', 'Remove');
		confirmDialog
			.getBody()
			.should(
				'have.text',
				'Are you sure you want to remove "DEF" from watchlist "ABC"'
			);
		confirmDialog.getOkButton().click();

		cy.wait('@removeStockFromWatchlist_DEF_ABC');
	});

	it('removes watchlist on mobile', () => {
		throw new Error();
	});

	it('renders all the watchlists on desktop', () => {
		tradierApi.getCalendar();
		watchlistApi.getAllWatchlists();
		watchlistApi.getWatchlistNames();
		tradierApi.getStockData('GHI', '1week');
		tradierApi.getStockData('DEF', '1week');
		coinGeckoApi.getCryptoData('BTC', '1week');
		coinGeckoApi.getCryptoData('ETH', '1week');
		cy.mount();

		watchlistPage
			.getPageTitle()
			.should('have.text', 'Investment Watchlists');
		accordion.getPanels().should('have.length', 3);

		navbarPage.desktop.getOneWeekItem().click();

		cy.repeat(3, (index) => {
			accordion
				.getPanels()
				.eq(index)
				.then(($elem) => {
					accordion
						.getPanelTitle($elem)
						.should('have.text', WATCHLIST_NAMES[index]);
					if (index != 1) {
						accordion.desktop
							.getPanelRenameButton($elem)
							.should('have.text', 'Rename');
						accordion.desktop
							.getPanelRemoveButton($elem)
							.should('have.text', 'Remove');
					} else {
						accordion.desktop
							.getPanelRenameButton($elem)
							.should('not.exist');
						accordion.desktop
							.getPanelRemoveButton($elem)
							.should('not.exist');
					}
				});
		});

		accordion.getPanels().eq(0).click();
		accordion.getPanelBody(0).should('be.visible');
		investments.getCards().should('have.length', 2);
		investments
			.getRemoveButton(0)
			.should('have.length', 1)
			.should('have.text', 'Remove');

		accordion.getPanels().eq(1).click();
		accordion.getPanelBody(1).should('be.visible');
		investments.getCards().should('have.length', 2);
		investments.getRemoveButton(0).should('not.exist');
	});

	it('renders all the watchlists on mobile', () => {
		tradierApi.getCalendar();
		watchlistApi.getAllWatchlists();
		watchlistApi.getWatchlistNames();
		tradierApi.getStockData('GHI', '1week');
		tradierApi.getStockData('DEF', '1week');
		coinGeckoApi.getCryptoData('BTC', '1week');
		coinGeckoApi.getCryptoData('ETH', '1week');
		cy.mount({
			viewport: 'mobile'
		});

		watchlistPage
			.getPageTitle()
			.contains('Investment')
			.contains('Watchlists');
		accordion.getPanels().should('have.length', 3);

		navbarPage.mobile.getTimeMenu().click();
		navbarPage.mobile.getOneWeekItem().click();

		cy.repeat(3, (index) => {
			accordion
				.getPanels()
				.eq(index)
				.then(($elem) => {
					accordion
						.getPanelTitle($elem)
						.should('have.text', WATCHLIST_NAMES[index]);
					if (index != 1) {
						accordion.mobile
							.getPanelActionsButton($elem)
							.should('have.text', '...')
							.click();
						accordion.mobile
							.getPanelRenameButton()
							.should('have.text', 'Rename');
						accordion.mobile
							.getPanelRemoveButton()
							.should('have.text', 'Remove');
					} else {
						accordion.mobile
							.getPanelActionsButton($elem)
							.should('not.exist');
					}
				});
		});

		accordion.getPanels().eq(0).click();
		accordion.getPanelBody(0).should('be.visible');
		investments.getCards().should('have.length', 2);
		investments
			.getRemoveButton(0)
			.should('have.length', 1)
			.should('have.text', 'Remove');

		accordion.getPanels().eq(1).click();
		accordion.getPanelBody(1).should('be.visible');
		investments.getCards().should('have.length', 2);
		investments.getRemoveButton(0).should('not.exist');
	});
});
