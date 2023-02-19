import { GetPanel } from './types';

export const createMobileAccordion = (getPanel: GetPanel) => {
	const getPanelActionsButton: GetPanel = (panel) =>
		getPanel(panel).find(
			'.ant-collapse-header .mobile-panel-actions button'
		);
	const getPanelRenameButton = () => cy.get('.ant-dropdown-menu-item').eq(0);
	const getPanelRemoveButton = () => cy.get('.ant-dropdown-menu-item').eq(1);

	return {
		getPanelActionsButton,
		getPanelRenameButton,
		getPanelRemoveButton
	};
};
