import { ApiServer, newApiServer } from '../../../testutils/server';
import { renderApp } from '../../../testutils/RenderApp';
import { fireEvent, screen, waitFor, within } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import userEvent from '@testing-library/user-event';
import { ScreenContextValue } from '../../../../src/components/ScreenContext';

const PRICE_REGEX = /\$\d+\.\d{2}/;

const testCard = (symbol: string, price: string) => {
	const card = screen.getByTestId(`market-card-${symbol}`);
	expect(within(card).queryByText(new RegExp(symbol))).toHaveTextContent(
		`(${symbol}) My Stock`
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
	it('renders all watchlists on mobile', async () => {
		const screenContextValue: ScreenContextValue = {
			breakpoints: {
				xs: true
			}
		};
		renderApp({
			initialPath: '/market-tracker/watchlists',
			screenContextValue
		});
		await waitFor(() =>
			expect(
				screen.queryByText(/Investment.*Watchlists/)
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

		expect(screen.queryAllByTestId('mobile-panel-actions')).toHaveLength(
			apiServer.database.data.watchlists.length
		);

		expect(screen.getByTestId('watchlist-page').className).toContain('xs');
		expect(screen.getAllByText('...')).toHaveLength(
			apiServer.database.data.watchlists.length
		);

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

		expect(screen.queryAllByTestId('desktop-panel-actions')).toHaveLength(
			apiServer.database.data.watchlists.length
		);
		expect(screen.getByTestId('watchlist-page').className).not.toContain(
			'xs'
		);

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

	it.skip('renames a watchlist on mobile', async () => {
		const screenContextValue: ScreenContextValue = {
			breakpoints: {
				xs: true
			}
		};
		renderApp({
			initialPath: '/market-tracker/watchlists',
			screenContextValue
		});
		await waitFor(() =>
			expect(
				screen.queryAllByTestId('watchlist-panel-title')
			).toHaveLength(2)
		);
		expect(screen.queryAllByRole('button', { name: '...' })).toHaveLength(
			2
		);
		expect(screen.queryByText('Save')).not.toBeInTheDocument();
		expect(screen.queryByText('Cancel')).not.toBeInTheDocument();
		expect(screen.queryByText('First Watchlist')).toBeInTheDocument();

		userEvent.click(screen.getAllByRole('button', { name: '...' })[0]);
		await waitFor(() => expect(screen.getByText('Rename')).toBeVisible());
		expect(screen.getByText('Remove')).toBeVisible();
		userEvent.click(screen.getByText('Rename'));
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

		userEvent.click(screen.getByText('OK'));
		await waitFor(() =>
			expect(screen.queryByText(/Add .* to Watchlist/)).not.toBeVisible()
		);

		userEvent.click(screen.getByText('Watchlists'));
		await waitFor(() =>
			expect(screen.queryByText('First Watchlist')).toBeVisible()
		);
		userEvent.click(screen.getByText('First Watchlist'));
		await waitFor(() => expect(screen.getByText(/\(MSFT\)/)).toBeVisible());
	});

	it('adds stock to new watchlist', async () => {
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

		userEvent.click(screen.getByText('New Watchlist'));
		userEvent.type(
			screen.getByTestId('new-watchlist-input'),
			'New Watchlist'
		);

		userEvent.click(screen.getByText('OK'));
		await waitFor(() =>
			expect(screen.queryByText(/Add .* to Watchlist/)).not.toBeVisible()
		);

		userEvent.click(screen.getByText('Watchlists'));
		await waitFor(() =>
			expect(screen.queryByText('New Watchlist')).toBeVisible()
		);
		userEvent.click(screen.getByText('New Watchlist'));
		await waitFor(() => expect(screen.getByText(/\(MSFT\)/)).toBeVisible());
	});

	it('remove stock from watchlist', async () => {
		renderApp({
			initialPath: '/market-tracker/watchlists'
		});
		await waitFor(() =>
			expect(screen.queryByText('Investment Watchlists')).toBeVisible()
		);
		await waitFor(() =>
			expect(screen.queryByText('First Watchlist')).toBeVisible()
		);

		userEvent.click(screen.getByText('First Watchlist'));
		await waitFor(() =>
			expect(screen.queryByText(/\(VTI\)/)).toBeVisible()
		);
		expect(screen.queryByText(/\(VOO\)/)).toBeVisible();

		const vooCard = screen.getByTestId('market-card-VOO');
		await waitFor(() =>
			expect(within(vooCard).queryByText('Remove')).toBeVisible()
		);
		userEvent.click(within(vooCard).getByText('Remove'));

		const confirmMsg =
			'Are you sure you want to remove "VOO" from watchlist "First Watchlist"';

		await waitFor(() =>
			expect(screen.queryByText(confirmMsg)).toBeVisible()
		);

		userEvent.click(screen.getByText('OK'));
		await waitFor(() =>
			expect(screen.queryByText(confirmMsg)).not.toBeVisible()
		);
		await waitFor(() =>
			expect(screen.queryByText('First Watchlist')).toBeVisible()
		);

		userEvent.click(screen.getByText('First Watchlist'));
		await waitFor(() =>
			expect(screen.queryByText(/\(VTI\)/)).toBeVisible()
		);
		expect(screen.queryByText(/\(VOO\)/)).not.toBeInTheDocument();
	});

	it.skip('removes watchlist on mobile', async () => {
		throw new Error();
	});

	it('removes watchlist', async () => {
		renderApp({
			initialPath: '/market-tracker/watchlists'
		});
		await waitFor(() =>
			expect(screen.queryByText('Investment Watchlists')).toBeVisible()
		);
		await waitFor(() =>
			expect(screen.queryAllByText('Remove')).toHaveLength(2)
		);
		expect(screen.getByText('First Watchlist')).toBeVisible();
		expect(screen.getByText('Second Watchlist')).toBeVisible();

		userEvent.click(screen.getAllByText('Remove')[0]);
		await waitFor(() =>
			expect(
				screen.queryByText(
					'Are you sure you want to remove watchlist "First Watchlist"'
				)
			).toBeVisible()
		);
		userEvent.click(screen.getByText('OK'));

		await waitFor(() =>
			expect(screen.queryAllByText('Remove')).toHaveLength(1)
		);
		await waitFor(() =>
			expect(screen.queryByText('Second Watchlist')).toBeVisible()
		);
		expect(screen.queryByText('First Watchlist')).not.toBeInTheDocument();
	});

	it('add watchlist from watchlists page', async () => {
		renderApp({
			initialPath: '/market-tracker/watchlists'
		});
		await waitFor(() =>
			expect(screen.queryByText('Investment Watchlists')).toBeVisible()
		);
		await waitFor(() =>
			expect(screen.queryAllByText('Remove')).toHaveLength(2)
		);
		expect(screen.queryByText('Add')).toBeVisible();

		userEvent.click(screen.getByText('Add'));

		await waitFor(() =>
			expect(screen.queryByText('Add Watchlist')).toBeVisible()
		);

		userEvent.type(screen.getByLabelText('Name'), 'New Watchlist');
		userEvent.click(screen.getByText('OK'));

		await waitFor(() =>
			expect(screen.queryByText('Add Watchlist')).not.toBeVisible()
		);
		await waitFor(() =>
			expect(screen.queryByText('New Watchlist')).toBeVisible()
		);
		expect(screen.queryAllByText('Remove')).toHaveLength(3);
	});
});
