import { createDesktopAccordion } from './desktopAccordion';
import { type GetPanel } from './types';
import { createMobileAccordion } from './mobileAccordion';

const getPanels = (id?: string) => {
	if (id) {
		return cy.get(`#${id} .AccordionPanel`);
	}
	return cy.get('.Accordion .AccordionPanel');
};

const getPanel: GetPanel = (panel) => {
	if (typeof panel === 'number') {
		return getPanels().eq(panel);
	}
	return cy.wrap(panel);
};

const getPanelTitle = (panel: JQuery | number) =>
	getPanel(panel).find('.ant-collapse-header-text h4');
const getPanelBody = (panel: JQuery | number) =>
	getPanel(panel).find('.ant-collapse-content-active');

export const accordion = {
	getPanels,
	getPanelTitle,
	getPanelBody,
	desktop: createDesktopAccordion(getPanel),
	mobile: createMobileAccordion(getPanel)
};
