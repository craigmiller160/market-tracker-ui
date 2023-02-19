const getPageTitle = () => cy.get('.WatchlistsPage h1');
const getAddButton = () => cy.get('.WatchlistsPage .RootActions button');

const getWatchlistPanels = () =>
	cy.get('.WatchlistsPage .Accordion .AccordionPanel');
const getWatchlistPanelTitle = (panel: JQuery) =>
	cy.wrap(panel).find('.ant-collapse-header-text h4');
const getWatchlistPanelRenameButton = (panel: JQuery) =>
	cy
		.wrap(panel)
		.find('.ant-collapse-header .ant-collapse-extra button')
		.eq(0);
const getWatchlistPanelRemoveButton = (panel: JQuery) =>
	cy
		.wrap(panel)
		.find('.ant-collapse-header .ant-collapse-extra button')
		.eq(1);
export const watchlistPage = {
	getPageTitle,
	getAddButton,
	getWatchlistPanels,
	getWatchlistPanelTitle,
	getWatchlistPanelRenameButton,
	getWatchlistPanelRemoveButton
};
