import { navbarPage } from './pages/navbar';
import { tradierApi } from './api/tradier';
import { watchlistApi } from './api/watchlists';

const SELECTED_CLASS = 'ant-menu-item-selected';

describe('Navigation', () => {
	it('navigation on mobile does not use selected class', () => {
		tradierApi.getCalendar();
		watchlistApi.getAllWatchlists();
		watchlistApi.getWatchlistNames();
		cy.mount({
			viewport: 'mobile'
		});
		navbarPage.getTitle().should('have.text', 'Market Tracker');
		navbarPage.mobile
			.getPageMenu()
			.should('have.text', 'Watchlists')
			.closest('li')
			.should('not.have.class', SELECTED_CLASS);
		navbarPage.mobile
			.getTimeMenu()
			.should('have.text', 'Today')
			.closest('li')
			.should('not.have.class', SELECTED_CLASS);

		navbarPage.mobile.getPageMenu().click();
		navbarPage.mobile.getSearchItem().click();
		navbarPage.mobile
			.getPageMenu()
			.should('have.text', 'Search')
			.closest('li')
			.should('not.have.class', SELECTED_CLASS);

		navbarPage.mobile.getTimeMenu().click();
		navbarPage.mobile.getFiveYearsItem().click();
		navbarPage.mobile
			.getTimeMenu()
			.should('have.text', '5 Years')
			.closest('li')
			.should('not.have.class', SELECTED_CLASS);
	});
});
