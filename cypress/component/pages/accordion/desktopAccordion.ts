import Chainable = Cypress.Chainable;

export const createDesktopAccordion = (
	getPanel: (panel: JQuery | number) => Chainable<JQuery>
) => {
	const getPanelRenameButton = (panel: JQuery | number) =>
		getPanel(panel).find(
			'.ant-collapse-header .ant-collapse-extra button:nth-child(1)'
		);
	const getPanelRemoveButton = (panel: JQuery | number) =>
		getPanel(panel).find(
			'.ant-collapse-header .ant-collapse-extra button:nth-child(2)'
		);
	return {
		getPanelRenameButton,
		getPanelRemoveButton
	};
};
