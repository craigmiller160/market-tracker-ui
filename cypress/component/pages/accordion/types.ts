import Chainable = Cypress.Chainable;

export type GetPanel = (panel: JQuery | number) => Chainable<JQuery>;
