import MockAdapter from 'axios-mock-adapter';
import { screen, waitFor } from '@testing-library/react';
import { ajaxApi } from '../../../../src/services/AjaxApi';
import { createRenderApp } from '../../../testutils/RenderApp';
import '@testing-library/jest-dom/extend-expect';
import userEvent from '@testing-library/user-event';

const mockApi = new MockAdapter(ajaxApi.instance);
const renderApp = createRenderApp(mockApi);

const getSearchBtn = () => screen.getByRole('button', { name: 'Search' });
const getSymbolField = () => screen.getByPlaceholderText('Symbol');

describe('Search', () => {
	it('renders initial layout correctly', async () => {
		await renderApp({
			initialPath: '/market-tracker/search'
		});
		expect(screen.queryByText('Search For Investment')).toBeInTheDocument();
		expect(screen.queryByText('Stock')).toBeInTheDocument();
		expect(screen.queryByText('Crypto')).toBeInTheDocument();
		expect(
			screen.queryByRole('button', { name: 'Search' })
		).toBeInTheDocument();
		expect(getSearchBtn()).toBeDisabled();
		expect(screen.queryByPlaceholderText('Symbol')).toBeInTheDocument();
	});

	it('formats value and changes button status when text input happens', async () => {
		await renderApp({
			initialPath: '/market-tracker/search'
		});
		expect(getSearchBtn()).toBeDisabled();
		userEvent.type(getSymbolField(), 'hello');
		await waitFor(() => expect(getSymbolField()).toHaveValue('HELLO'));
		expect(getSearchBtn()).toBeEnabled();

		userEvent.clear(getSymbolField());
		await waitFor(() => expect(getSymbolField()).toHaveValue(''));
		expect(getSearchBtn()).toBeDisabled();
	});
});
