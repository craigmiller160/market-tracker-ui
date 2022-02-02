import MockAdapter from 'axios-mock-adapter';
import { ajaxApi } from '../../../../src/services/AjaxApi';
import { createRenderApp } from '../../../testutils/RenderApp';

const mockApi = new MockAdapter(ajaxApi.instance);
const renderApp = createRenderApp(mockApi);

describe('Markets', () => {
	beforeEach(() => {
		mockApi.reset();
	});

	it('renders for today', async () => {
		throw new Error();
	});

	it('renders for 1 week', async () => {
		throw new Error();
	});

	it('renders for 1 month', async () => {
		throw new Error();
	});

	it('renders for 3 months', async () => {
		throw new Error();
	});

	it('renders for 1 year', async () => {
		throw new Error();
	});

	it('renders for 5 years', async () => {
		throw new Error();
	});
});
