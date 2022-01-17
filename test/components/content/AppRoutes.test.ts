import { ajaxApi } from '../../../src/services/AjaxApi';
import MockAdapter from 'axios-mock-adapter';
import { createRenderApp } from '../../testutils/RenderApp';

const mockApi = new MockAdapter(ajaxApi.instance);
const renderApp = createRenderApp(mockApi);

describe('AppRoutes', () => {
	beforeEach(() => {
		mockApi.reset();
	});

	it('shows correct initial route for un-authenticated user', () => {
		throw new Error();
	});

	it('shows correct initial route for authenticated user', () => {
		throw new Error();
	});

	it('navigates to portfolios page', () => {
		throw new Error();
	});

	it('navigates to watchlists page', () => {
		throw new Error();
	});
});
