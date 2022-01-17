import { ajaxApi } from '../../../src/services/AjaxApi';
import MockAdapter from 'axios-mock-adapter';
import { createRenderApp } from '../../testutils/RenderApp';

const mockApi = new MockAdapter(ajaxApi.instance);
const renderApp = createRenderApp(mockApi);

describe('AppRoutes', () => {
	beforeEach(() => {
		mockApi.reset();
	});

	it('shows correct initial route for un-authenticated user', async () => {
		throw new Error();
	});

	it('shows correct initial route for authenticated user', async () => {
		throw new Error();
	});

	it('renders portfolios route', async () => {
		throw new Error();
	});

	it('renders watchlists route', async () => {
		throw new Error();
	});
});
