export {};
describe('Navigation', () => {
	it('navigation on mobile does not use selected class', () => {
		cy.mount({
			viewport: 'mobile'
		});
		cy.get('.ant-notification-close-x').click();
		cy.get('.Brand .ant-menu-title-content').should(
			'have.text',
			'Market Tracker'
		);
		cy.get('.ant-menu-submenu-horizontal .ant-menu-title-content')
			.should('have.length', 2)
			.each(($elem, index) => {
				expect($elem.text()).eq(['Markets', 'Today'][index]);
			});
		cy.get('.ant-menu-submenu-horizontal .ant-menu-title-content')
			.eq(0)
			.click();
		cy.get('.ant-menu-sub .ant-menu-title-content').eq(2).click();
		cy.get('.ant-notification-close-x').click();
		cy.get('.ant-menu-submenu-horizontal .ant-menu-title-content')
			.should('have.length', 2)
			.each(($elem, index) => {
				expect($elem.text()).eq(['Watchlists', 'Today'][index]);
			});
	});
});
