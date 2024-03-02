import MockAdapter from 'axios-mock-adapter';
import { screen, waitFor, within } from '@testing-library/react';
import { marketTrackerApiFpTs } from '../../../../src/services/AjaxApi';
import { renderApp } from '../../../testutils/RenderApp';
import userEvent from '@testing-library/user-event';
import {
	mockCalenderRequest,
	mockTradierHistoryRequest,
	mockTradierQuoteNotFound,
	mockTradierQuoteRequest,
	mockTradierTimesaleRequest
} from '../../../testutils/testDataUtils';
import { MarketTime } from '../../../../src/types/MarketTime';
import { type ApiServer, newApiServer } from '../../../testutils/server';

const mockApi = new MockAdapter(marketTrackerApiFpTs.instance);

const getSearchBtn = () => screen.getByRole('button', { name: 'Search' });
const getSymbolField = () => screen.getByPlaceholderText('Symbol');

describe('Search', () => {
	let apiServer: ApiServer;
	beforeEach(() => {
		apiServer = newApiServer();
		mockApi.reset();
		mockApi.onGet('/oauth/user').passThrough();
	});

	afterEach(() => {
		apiServer.server.shutdown();
	});

	it('renders initial layout correctly', async () => {
		renderApp({
			initialPath: '/market-tracker/search'
		});
		await waitFor(() =>
			expect(screen.queryAllByText('Search')).toHaveLength(3)
		);
		expect(screen.getByText('Stock')).toBeInTheDocument();
		expect(screen.getByText('Crypto')).toBeInTheDocument();
		expect(
			screen.getByRole('button', { name: 'Search' })
		).toBeInTheDocument();
		expect(getSearchBtn()).toBeDisabled();
		expect(screen.getByPlaceholderText('Symbol')).toBeInTheDocument();
	});

	it('formats value and changes button status when text input happens', async () => {
		renderApp({
			initialPath: '/market-tracker/search'
		});
		await waitFor(() =>
			expect(screen.queryAllByText('Search')).toHaveLength(3)
		);
		expect(getSearchBtn()).toBeDisabled();
		await userEvent.type(getSymbolField(), 'hello');
		await waitFor(() => expect(getSymbolField()).toHaveValue('HELLO'));
		expect(getSearchBtn()).toBeEnabled();

		await userEvent.clear(getSymbolField());
		await waitFor(() => expect(getSymbolField()).toHaveValue(''));
		expect(getSearchBtn()).toBeDisabled();
	});

	it('searches for and finds a stock for Today', async () => {
		mockCalenderRequest(mockApi);
		mockTradierQuoteRequest(mockApi, 'VTI', 1);
		mockTradierTimesaleRequest(mockApi, 'VTI', 1);
		renderApp({
			initialPath: '/market-tracker/search'
		});
		await waitFor(() =>
			expect(screen.queryAllByText('Search')).toHaveLength(3)
		);
		await userEvent.type(getSymbolField(), 'VTI');
		await userEvent.click(getSearchBtn());
		await screen.findByTestId('market-card-VTI');
		const card = screen.getByTestId('market-card-VTI');
		expect(within(card).queryByText(/VTI/)).toHaveTextContent('(VTI)');
		await waitFor(() =>
			expect(within(card).queryByText(/Chart/)).toHaveTextContent(
				'Chart is Here'
			)
		);
		expect(within(card).queryByText(/101/)).toHaveTextContent('$101.00');
		expect(within(card).queryByText(/225/)).toHaveTextContent(
			'(+$70.00, +225.81%)'
		);
	});

	it('searches for and finds a stock for Today, with the market closed', async () => {
		mockCalenderRequest(mockApi, 'closed');
		mockTradierQuoteRequest(mockApi, 'VTI', 1);
		renderApp({
			initialPath: '/market-tracker/search'
		});
		await waitFor(() =>
			expect(screen.queryAllByText('Search')).toHaveLength(3)
		);
		await userEvent.type(getSymbolField(), 'VTI');
		await userEvent.click(getSearchBtn());
		await screen.findByTestId('market-card-VTI');
		const card = screen.getByTestId('market-card-VTI');
		expect(within(card).queryByText(/VTI/)).toHaveTextContent('(VTI)');
		expect(within(card).queryByText(/Chart/)).not.toBeInTheDocument();
		await waitFor(() =>
			expect(within(card).queryByText(/101/)).toHaveTextContent('$101.00')
		);
		expect(within(card).queryByText(/225/)).not.toBeInTheDocument();
		expect(within(card).getByText('Market Closed')).toBeInTheDocument();
	});

	it('searches for and finds a stock for One Week', async () => {
		mockCalenderRequest(mockApi);
		mockTradierQuoteRequest(mockApi, 'VTI', 1);
		mockTradierHistoryRequest(mockApi, 'VTI', MarketTime.ONE_WEEK, 1);
		renderApp({
			initialPath: '/market-tracker/search'
		});
		await waitFor(() =>
			expect(screen.queryAllByText('Search')).toHaveLength(3)
		);
		await userEvent.click(screen.getByText('1 Week'));
		await userEvent.type(getSymbolField(), 'VTI');
		await userEvent.click(getSearchBtn());
		await screen.findByTestId('market-card-VTI');
		const card = screen.getByTestId('market-card-VTI');
		expect(within(card).queryByText(/VTI/)).toHaveTextContent('(VTI)');
		await waitFor(() =>
			expect(within(card).queryByText(/Chart/)).toHaveTextContent(
				'Chart is Here'
			)
		);
		expect(within(card).queryByText(/101/)).toHaveTextContent('$101.00');
		expect(within(card).queryByText(/98/)).toHaveTextContent(
			'(+$50.00, +98.04%)'
		);
	});

	it('searches for and finds a stock for One Month', async () => {
		mockCalenderRequest(mockApi);
		mockTradierQuoteRequest(mockApi, 'VTI', 1);
		mockTradierHistoryRequest(mockApi, 'VTI', MarketTime.ONE_MONTH, 1);
		renderApp({
			initialPath: '/market-tracker/search'
		});
		await waitFor(() =>
			expect(screen.queryAllByText('Search')).toHaveLength(3)
		);
		await userEvent.click(screen.getByText('1 Month'));
		await userEvent.type(getSymbolField(), 'VTI');
		await userEvent.click(getSearchBtn());
		await screen.findByTestId('market-card-VTI');
		const card = screen.getByTestId('market-card-VTI');
		expect(within(card).queryByText(/VTI/)).toHaveTextContent('(VTI)');
		await waitFor(() =>
			expect(within(card).queryByText(/Chart/)).toHaveTextContent(
				'Chart is Here'
			)
		);
		expect(within(card).queryByText(/101/)).toHaveTextContent('$101.00');
		expect(within(card).queryByText(/98/)).toHaveTextContent(
			'(+$50.00, +98.04%)'
		);
	});

	it('searches for and finds a stock for Three Months', async () => {
		mockCalenderRequest(mockApi);
		mockTradierQuoteRequest(mockApi, 'VTI', 1);
		mockTradierHistoryRequest(mockApi, 'VTI', MarketTime.THREE_MONTHS, 1);
		renderApp({
			initialPath: '/market-tracker/search'
		});
		await waitFor(() =>
			expect(screen.queryAllByText('Search')).toHaveLength(3)
		);
		await userEvent.click(screen.getByText('3 Months'));
		await userEvent.type(getSymbolField(), 'VTI');
		await userEvent.click(getSearchBtn());
		await screen.findByTestId('market-card-VTI');
		const card = screen.getByTestId('market-card-VTI');
		expect(within(card).queryByText(/VTI/)).toHaveTextContent('(VTI)');
		await waitFor(() =>
			expect(within(card).queryByText(/Chart/)).toHaveTextContent(
				'Chart is Here'
			)
		);
		expect(within(card).queryByText(/101/)).toHaveTextContent('$101.00');
		expect(within(card).queryByText(/98/)).toHaveTextContent(
			'(+$50.00, +98.04%)'
		);
	});

	it('searches for and finds a stock for One Year', async () => {
		mockCalenderRequest(mockApi);
		mockTradierQuoteRequest(mockApi, 'VTI', 1);
		mockTradierHistoryRequest(mockApi, 'VTI', MarketTime.ONE_YEAR, 1);
		renderApp({
			initialPath: '/market-tracker/search'
		});
		await waitFor(() =>
			expect(screen.queryAllByText('Search')).toHaveLength(3)
		);
		await userEvent.click(screen.getByText('1 Year'));
		await userEvent.type(getSymbolField(), 'VTI');
		await userEvent.click(getSearchBtn());
		await screen.findByTestId('market-card-VTI');
		const card = screen.getByTestId('market-card-VTI');
		expect(within(card).queryByText(/VTI/)).toHaveTextContent('(VTI)');
		await waitFor(() =>
			expect(within(card).queryByText(/Chart/)).toHaveTextContent(
				'Chart is Here'
			)
		);
		expect(within(card).queryByText(/101/)).toHaveTextContent('$101.00');
		expect(within(card).queryByText(/98/)).toHaveTextContent(
			'(+$50.00, +98.04%)'
		);
	});

	it('searches for and finds a stock for Five Years', async () => {
		mockCalenderRequest(mockApi);
		mockTradierQuoteRequest(mockApi, 'VTI', 1);
		mockTradierHistoryRequest(mockApi, 'VTI', MarketTime.FIVE_YEARS, 1);
		renderApp({
			initialPath: '/market-tracker/search'
		});
		await waitFor(() =>
			expect(screen.queryAllByText('Search')).toHaveLength(3)
		);
		await userEvent.click(screen.getByText('5 Years'));
		await userEvent.type(getSymbolField(), 'VTI');
		await userEvent.click(getSearchBtn());
		await screen.findByTestId('market-card-VTI');
		const card = screen.getByTestId('market-card-VTI');
		expect(within(card).queryByText(/VTI/)).toHaveTextContent('(VTI)');
		await waitFor(() =>
			expect(within(card).queryByText(/Chart/)).toHaveTextContent(
				'Chart is Here'
			)
		);
		expect(within(card).queryByText(/101/)).toHaveTextContent('$101.00');
		expect(within(card).queryByText(/98/)).toHaveTextContent(
			'(+$50.00, +98.04%)'
		);
	});

	it('searches for but cannot find a stock', async () => {
		mockCalenderRequest(mockApi);
		mockTradierQuoteNotFound(mockApi, 'VTI');
		renderApp({
			initialPath: '/market-tracker/search'
		});
		await waitFor(() =>
			expect(screen.queryAllByText('Search')).toHaveLength(3)
		);
		await userEvent.type(getSymbolField(), 'VTI');
		await userEvent.click(getSearchBtn());
		await screen.findByTestId('market-card-VTI');
		const card = screen.getByTestId('market-card-VTI');
		await waitFor(() =>
			expect(within(card).queryByText(/Error/)).toHaveTextContent(
				/Investment not found. Symbol: VTI/
			)
		);
	});
});
