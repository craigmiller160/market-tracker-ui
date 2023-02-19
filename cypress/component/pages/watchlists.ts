const getPageTitle = () => cy.get('.WatchlistsPage h1');
const getAddButton = () => cy.get('.WatchlistsPage .RootActions button');

const getWatchlistPanels = () =>
	cy.get('.WatchlistsPage .Accordion .AccordionPanel');
const getWatchlistPanelRenameButton = (index: number) =>
	getWatchlistPanels()
		.eq(index)
		.get('.ant-collapse-header .ant-collapse-extra button')
		.eq(0);
const getWatchlistPanelRemoveButton = (index: number) =>
	getWatchlistPanels()
		.eq(index)
		.get('.ant-collapse-header .ant-collapse-extra button')
		.eq(1);
export const watchlistPage = {
	getPageTitle,
	getAddButton,
	getWatchlistPanels,
	getWatchlistPanelRenameButton,
	getWatchlistPanelRemoveButton
};
