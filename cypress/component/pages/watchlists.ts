import Chainable = Cypress.Chainable;

const getPageTitle = () => cy.get('.WatchlistsPage h1');
const getAddButton = () => cy.get('.WatchlistsPage .RootActions button');

const getPanels = () => cy.get('.WatchlistsPage .Accordion .AccordionPanel');

const getPanel = (panel: JQuery | number): Chainable<JQuery> => {
	if (typeof panel === 'number') {
		return getPanels().eq(panel);
	}
	return cy.wrap(panel);
};

const getPanelTitle = (panel: JQuery | number) =>
	getPanel(panel).find('.ant-collapse-header-text h4');
const getPanelRenameButton = (panel: JQuery | number) =>
	getPanel(panel).find(
		'.ant-collapse-header .ant-collapse-extra button:nth-child(1)'
	);
const getPanelRemoveButton = (panel: JQuery | number) =>
	getPanel(panel).find(
		'.ant-collapse-header .ant-collapse-extra button:nth-child(2)'
	);
const getPanelBody = (panel: JQuery | number) =>
	getPanel(panel).find('.ant-collapse-content-active');

const getInvestmentCards = () => cy.get('.InvestmentCard');
export const watchlistPage = {
	getPageTitle,
	getAddButton,
	getPanels,
	getPanelTitle,
	getPanelRenameButton,
	getPanelRemoveButton,
	getPanelBody,
	getInvestmentCards
};
