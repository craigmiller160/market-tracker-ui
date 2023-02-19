const getPageTitle = () => cy.get('.WatchlistsPage h1');
const getAddButton = () => cy.get('.WatchlistsPage .RootActions button');

const getPanels = () => cy.get('.WatchlistsPage .Accordion .AccordionPanel');
const getPanelTitle = (panel: JQuery) =>
	cy.wrap(panel).find('.ant-collapse-header-text h4');
const getPanelRenameButton = (panel: JQuery) =>
	cy
		.wrap(panel)
		.find('.ant-collapse-header .ant-collapse-extra button:nth-child(1)');
const getPanelRemoveButton = (panel: JQuery) =>
	cy
		.wrap(panel)
		.find('.ant-collapse-header .ant-collapse-extra button:nth-child(2)');
export const watchlistPage = {
	getPageTitle,
	getAddButton,
	getPanels,
	getPanelTitle,
	getPanelRenameButton,
	getPanelRemoveButton
};
