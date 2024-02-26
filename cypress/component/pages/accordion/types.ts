type Chainable<T> = Cypress.Chainable<T>;

export type GetPanel = (panel: JQuery | number) => Chainable<JQuery>;
