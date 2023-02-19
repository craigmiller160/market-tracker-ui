import Chainable = Cypress.Chainable;
import { GetPanel, ViewportAccordion } from './types';

export const createDesktopAccordion = (
	getPanel: GetPanel
): ViewportAccordion => {
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
