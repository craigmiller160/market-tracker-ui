import MockAdapter from 'axios-mock-adapter';
import { screen, waitFor, within } from '@testing-library/react';
import { ajaxApi } from '../../../../src/services/AjaxApi';
import { createRenderApp } from '../../../testutils/RenderApp';
import '@testing-library/jest-dom/extend-expect';
import userEvent from '@testing-library/user-event';
import {
	mockCalenderRequest,
	mockTradierQuoteRequest,
	mockTradierTimesaleRequest
} from '../../../testutils/testDataUtils';

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

	it('searches for and finds a stock for Today', async () => {
		mockCalenderRequest(mockApi);
		mockTradierQuoteRequest(mockApi, 'VTI', 1);
		mockTradierTimesaleRequest(mockApi, 'VTI', 1);
		await renderApp({
			initialPath: '/market-tracker/search'
		});
		userEvent.type(getSymbolField(), 'VTI');
		userEvent.click(getSearchBtn());
		await waitFor(() =>
			expect(screen.queryByTestId('market-card-VTI')).toBeInTheDocument()
		);
		const card = screen.getByTestId('market-card-VTI');
		expect(within(card).queryByText(/VTI/)).toHaveTextContent('(VTI)');
		expect(within(card).queryByText(/Chart/)).toHaveTextContent(
			'Chart is Here'
		);
		screen.debug(card);
		// TODO finish the test
	});

	it('searches for and finds a stock for Today, with the market closed', async () => {
		throw new Error();
	});

	it('searches for and finds a stock for One Week', async () => {
		throw new Error();
	});

	it('searches for and finds a stock for One Month', async () => {
		throw new Error();
	});

	it('searches for and finds a stock for Three Months', async () => {
		throw new Error();
	});

	it('searches for and finds a stock for One Year', async () => {
		throw new Error();
	});

	it('searches for and finds a stock for Five Years', async () => {
		throw new Error();
	});

	it('searches for but cannot find a stock', async () => {
		throw new Error();
	});
});
