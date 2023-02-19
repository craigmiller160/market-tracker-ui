import { navbarPage } from './pages/navbar';
import { tradierApi } from './api/tradier';

const SELECTED_CLASS = 'ant-menu-item-selected';

describe('Navigation', () => {
	it('navigation on mobile does not use selected class', () => {
		tradierApi.getCalendar('2023', '02');
		cy.mount({
			viewport: 'mobile'
		});
		navbarPage.getTitle().should('have.text', 'Market Tracker');
		navbarPage
			.getMobilePageMenu()
			.should('have.text', 'Markets')
			.closest('li')
			.should('not.have.class', SELECTED_CLASS);
		navbarPage
			.getMobileTimeMenu()
			.should('have.text', 'Today')
			.closest('li')
			.should('not.have.class', SELECTED_CLASS);

		navbarPage.getMobilePageMenu().click();
		navbarPage.getMobileWatchlistsItem().click();
		navbarPage
			.getMobilePageMenu()
			.should('have.text', 'Watchlists')
			.closest('li')
			.should('not.have.class', SELECTED_CLASS);

		cy.get('.ant-notification-close-x').click();
		navbarPage.getMobileTimeMenu().click();
		navbarPage.getMobileFiveYearsItem().click();
		navbarPage
			.getMobileTimeMenu()
			.should('have.text', '5 Years')
			.closest('li')
			.should('not.have.class', SELECTED_CLASS);
	});
});
