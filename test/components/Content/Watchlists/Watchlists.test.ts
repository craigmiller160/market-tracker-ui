import { ApiServer, newApiServer } from '../../../testutils/server';
import { renderApp } from '../../../testutils/RenderApp';
import { fireEvent, screen, waitFor, within } from '@testing-library/react';
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

const getSymbolField = () => screen.getByPlaceholderText('Symbol');
const getSearchBtn = () => screen.getByRole('button', { name: 'Search' });

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
		renderApp({
			initialPath: '/market-tracker/watchlists'
		});
		await waitFor(() =>
			expect(
				screen.queryAllByTestId('watchlist-panel-title')
			).toHaveLength(2)
		);
		expect(screen.queryAllByText('Rename')).toHaveLength(2);
		expect(screen.queryByText('Save')).not.toBeInTheDocument();
		expect(screen.queryByText('Cancel')).not.toBeInTheDocument();
		expect(screen.queryByText('First Watchlist')).toBeInTheDocument();

		userEvent.click(screen.queryAllByText('Rename')[0]);
		expect(screen.queryByText('First Watchlist')).not.toBeInTheDocument();
		expect(
			screen.queryByDisplayValue('First Watchlist')
		).toBeInTheDocument();
		expect(screen.queryByText('Rename')).not.toBeInTheDocument();
		expect(screen.queryByText('Save')).toBeInTheDocument();
		expect(screen.queryByText('Cancel')).toBeInTheDocument();

		userEvent.click(screen.getByText('Cancel'));
		expect(screen.queryByText('First Watchlist')).toBeInTheDocument();
		expect(screen.queryAllByText('Rename')).toHaveLength(2);

		userEvent.click(screen.queryAllByText('Rename')[0]);
		const input = screen.getByDisplayValue('First Watchlist');
		userEvent.clear(input);
		userEvent.type(input, 'New Watchlist');

		userEvent.click(screen.getByText('Save'));
		await waitFor(() =>
			expect(screen.queryByText('New Watchlist')).toBeInTheDocument()
		);
		expect(screen.queryAllByText('Rename')).toHaveLength(2);
	});

	it('adds stock to existing watchlist', async () => {
		renderApp({
			initialPath: '/market-tracker/search'
		});
		await waitFor(() =>
			expect(screen.queryByTestId('search-page')).toBeInTheDocument()
		);
		userEvent.type(getSymbolField(), 'MSFT');
		userEvent.click(getSearchBtn());
		await waitFor(() =>
			expect(screen.queryByTestId('market-card-MSFT')).toBeInTheDocument()
		);
		const card = screen.getByTestId('market-card-MSFT');
		await waitFor(
			() =>
				expect(
					within(card).queryByText(/\+ Watchlist/)
				).toBeInTheDocument(),
			{
				timeout: 30000
			}
		);
		const addWatchlistBtn = within(card).getByText(/\+ Watchlist/);
		userEvent.click(addWatchlistBtn);

		expect(screen.queryByText(/Add .* to Watchlist/)).toHaveTextContent(
			'Add MSFT to Watchlist'
		);
		await waitFor(() =>
			expect(screen.queryByLabelText('Existing Watchlist')).toBeChecked()
		);
		expect(screen.queryByLabelText('New Watchlist')).not.toBeChecked();

		const select = screen.getByTestId('existing-watchlist-select');
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		fireEvent.mouseDown(select.querySelector('.ant-select-selector')!);
		await waitFor(() =>
			expect(
				screen.queryByRole('option', { name: 'First Watchlist' })
			).toBeInTheDocument()
		);
		expect(
			screen.queryByRole('option', { name: 'Second Watchlist' })
		).toBeInTheDocument();

		fireEvent.click(screen.getAllByText('First Watchlist')[1]);
		// await waitFor(() => expect(screen.getByText('First Watchlist')).toBeInTheDocument());
		// screen.debug(screen.getByTestId('add-to-watchlist-modal')); // TODO delete this

		// TODO below here works
		userEvent.click(screen.getByText('OK'));
		await waitFor(() =>
			expect(screen.queryByText(/Add .* to Watchlist/)).not.toBeVisible()
		);
		// TODO select the existing watchlist and save and then validate
	});

	it('adds stock to new watchlist', async () => {
		throw new Error();
	});
});
