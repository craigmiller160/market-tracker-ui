import { ApiServer, newApiServer } from '../../../testutils/server';
import { renderApp } from '../../../testutils/RenderApp';
import { waitFor, within } from '@testing-library/react';
import { screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import userEvent from '@testing-library/user-event';

const PRICE_REGEX = /\$\d+\.\d{2}/;

const testCard = (symbol: string, price: string) => {
	const card = screen.getByTestId(`market-card-${symbol}`);
	expect(within(card).queryByText(new RegExp(symbol))).toHaveTextContent(
		`My Stock (${symbol})`
	);
	const priceNodes = within(card).getAllByText(PRICE_REGEX);
	expect(priceNodes).toHaveLength(2);
	expect(priceNodes[0]).toHaveTextContent(price);
};

describe('Watchlists', () => {
	let apiServer: ApiServer;
	beforeEach(() => {
		apiServer = newApiServer();
	});

	afterEach(() => {
		apiServer.server.shutdown();
	});
	it('renders all watchlists', async () => {
		renderApp({
			initialPath: '/market-tracker/watchlists'
		});
		await waitFor(() =>
			expect(
				screen.queryByText('Investment Watchlists')
			).toBeInTheDocument()
		);
		expect(apiServer.database.data.watchlists).toHaveLength(2);
		await waitFor(() =>
			expect(
				screen.queryAllByTestId('watchlist-panel-title')
			).toHaveLength(2)
		);
		apiServer.database.data.watchlists.forEach((watchlist) => {
			expect(
				screen.queryByText(watchlist.watchlistName)
			).toBeInTheDocument();
		});

		userEvent.click(screen.getAllByTestId('watchlist-panel-title')[0]);
		await waitFor(() =>
			expect(screen.queryAllByText('Chart is Here')).toHaveLength(2)
		);

		testCard('VTI', '$100.00');
		testCard('VOO', '$101.00');

		userEvent.click(screen.getAllByTestId('watchlist-panel-title')[1]);
		await waitFor(() =>
			expect(screen.queryAllByText('Chart is Here')).toHaveLength(2)
		);
		testCard('AAPL', '$102.00');
		testCard('GOOG', '$103.00');
	});

	it('renames a watchlist', async () => {
		throw new Error();
	});
});
