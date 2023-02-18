export {};
describe('Navigation', () => {
	it('navigation on mobile does not use selected class', () => {
		cy.mount();
		cy.get('.ant-menu-title-content').should('have.text', 'Market Tracker');
	});
});
