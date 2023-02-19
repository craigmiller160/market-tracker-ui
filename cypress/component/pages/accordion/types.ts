import Chainable = Cypress.Chainable;

export type GetPanel = (panel: JQuery | number) => Chainable<JQuery>;
export type ViewportAccordion = {
	getPanelRenameButton: GetPanel;
	getPanelRemoveButton: GetPanel;
};
