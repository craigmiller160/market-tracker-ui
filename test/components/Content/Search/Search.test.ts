import MockAdapter from 'axios-mock-adapter';
import { screen } from '@testing-library/react';
import { ajaxApi } from '../../../../src/services/AjaxApi';
import { createRenderApp } from '../../../testutils/RenderApp';

const mockApi = new MockAdapter(ajaxApi.instance);
const renderApp = createRenderApp(mockApi);

describe('Search', () => {
	it('renders initial layout correctly', async () => {
		await renderApp({
			initialPath: '/market-tracker/search'
		});
		expect(screen.queryByText('Search For Investment')).toBeInTheDocument();
	});

	it('formats text and enables/disables search button when symbol input provided', async () => {
		throw new Error();
	});
});
