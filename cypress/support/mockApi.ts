import MockAdapter from 'axios-mock-adapter';
import { ajaxApi } from '../../src/services/AjaxApi';
import Chainable = Cypress.Chainable;

const mockApiInstance = new MockAdapter(ajaxApi.instance);

export const mockApi = (op: (ma: MockAdapter) => void): Chainable<unknown> =>
	cy.wrap(op(mockApiInstance));
