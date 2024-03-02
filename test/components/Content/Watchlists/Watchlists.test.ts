import { type ApiServer, newApiServer } from '../../../testutils/server';
import { renderApp } from '../../../testutils/RenderApp';
import { fireEvent, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { type ScreenContextValue } from '../../../../src/components/ScreenContext';

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
		expect(screen.getByText('First Watchlist')).toBeInTheDocument();

		await userEvent.click(
			screen.getAllByRole('button', { name: '...' })[0]
		);
		await waitFor(() => expect(screen.getByText('Rename')).toBeVisible());
		expect(screen.getByText('Remove')).toBeVisible();
		await userEvent.click(screen.getByText('Rename'));
		expect(screen.queryByText('First Watchlist')).not.toBeInTheDocument();
		expect(
			screen.getByDisplayValue('First Watchlist')
		).toBeInTheDocument();
		expect(screen.queryByText('Rename')).not.toBeInTheDocument();
		expect(screen.getByText('Save')).toBeInTheDocument();
		expect(screen.getByText('Cancel')).toBeInTheDocument();

		await userEvent.click(screen.getByText('Cancel'));
		expect(screen.getByText('First Watchlist')).toBeInTheDocument();
		expect(screen.queryAllByText('Rename')).toHaveLength(2);

		await userEvent.click(screen.queryAllByText('Rename')[0]);
		const input = screen.getByDisplayValue('First Watchlist');
		await userEvent.clear(input);
		await userEvent.type(input, 'New Watchlist');

		await userEvent.click(screen.getByText('Save'));
		await screen.findByText('New Watchlist');
		expect(screen.queryAllByText('Rename')).toHaveLength(2);
	});

	it('renames a watchlist', async () => {
		renderApp({
			initialPath: '/market-tracker/watchlists'
		});
		await waitFor(() =>
			expect(
				screen.queryAllByTestId('watchlist-panel-title')
			).toHaveLength(3)
		);
		expect(screen.queryAllByText('Rename')).toHaveLength(2);
		expect(screen.queryByText('Save')).not.toBeInTheDocument();
		expect(screen.queryByText('Cancel')).not.toBeInTheDocument();
		expect(screen.getByText('First Watchlist')).toBeInTheDocument();

		await userEvent.click(screen.queryAllByText('Rename')[0]);
		expect(screen.queryByText('First Watchlist')).not.toBeInTheDocument();
		expect(screen.getByDisplayValue('First Watchlist')).toBeInTheDocument();
		expect(screen.queryByText('Rename')).not.toBeInTheDocument();
		expect(screen.getByText('Save')).toBeInTheDocument();
		expect(screen.getByText('Cancel')).toBeInTheDocument();

		await userEvent.click(screen.getByText('Cancel'));
		expect(screen.getByText('First Watchlist')).toBeInTheDocument();
		expect(screen.getAllByText('Rename')).toHaveLength(2);

		await userEvent.click(screen.queryAllByText('Rename')[0]);
		const input = screen.getByDisplayValue('First Watchlist');
		await userEvent.clear(input);
		await userEvent.type(input, 'New Watchlist');

		await userEvent.click(screen.getByText('Save'));
		await screen.findByText('New Watchlist');
		expect(screen.queryAllByText('Rename')).toHaveLength(2);
	});

	it('adds stock to existing watchlist', async () => {
		renderApp({
			initialPath: '/market-tracker/search'
		});
		await screen.findByTestId('search-page');
		await userEvent.type(getSymbolField(), 'MSFT');
		await userEvent.click(getSearchBtn());
		await screen.findByTestId('market-card-MSFT');
		const card = screen.getByTestId('market-card-MSFT');
		await waitFor(
			() =>
				expect(
					within(card).getByText(/\+ Watchlist/)
				).toBeInTheDocument(),
			{
				timeout: 30000
			}
		);
		const addWatchlistBtn = within(card).getByText(/\+ Watchlist/);
		await userEvent.click(addWatchlistBtn);

		expect(screen.queryByText(/Add .* to Watchlist/)).toHaveTextContent(
			'Add MSFT to Watchlist'
		);
		await waitFor(() =>
			expect(screen.queryByLabelText('Existing Watchlist')).toBeChecked()
		);
		expect(screen.queryByLabelText('New Watchlist')).not.toBeChecked();

		const select = screen.getByTestId('existing-watchlist-select');
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion, testing-library/no-node-access
		fireEvent.mouseDown(select.querySelector('.ant-select-selector')!);
		await screen.findByRole('option', { name: 'First Watchlist' });
		expect(
			screen.getByRole('option', { name: 'Second Watchlist' })
		).toBeInTheDocument();

		fireEvent.click(screen.getAllByText('First Watchlist')[1]);

		await userEvent.click(screen.getByText('OK'));
		await waitFor(() =>
			expect(screen.queryByText(/Add .* to Watchlist/)).not.toBeVisible()
		);

		await userEvent.click(screen.getByText('Investment Info'));
		await waitFor(() =>
			expect(screen.queryByText('First Watchlist')).toBeVisible()
		);
		await userEvent.click(screen.getByText('First Watchlist'));
		await waitFor(() => expect(screen.getByText(/\(MSFT\)/)).toBeVisible());
	});

	it('adds stock to new watchlist', async () => {
		renderApp({
			initialPath: '/market-tracker/search'
		});
		await screen.findByTestId('search-page');
		await userEvent.type(getSymbolField(), 'MSFT');
		await userEvent.click(getSearchBtn());
		await screen.findByTestId('market-card-MSFT');
		const card = screen.getByTestId('market-card-MSFT');
		await waitFor(
			() =>
				expect(
					within(card).getByText(/\+ Watchlist/)
				).toBeInTheDocument(),
			{
				timeout: 30000
			}
		);
		const addWatchlistBtn = within(card).getByText(/\+ Watchlist/);
		await userEvent.click(addWatchlistBtn);

		expect(screen.queryByText(/Add .* to Watchlist/)).toHaveTextContent(
			'Add MSFT to Watchlist'
		);
		await waitFor(() =>
			expect(screen.queryByLabelText('Existing Watchlist')).toBeChecked()
		);
		expect(screen.queryByLabelText('New Watchlist')).not.toBeChecked();

		await userEvent.click(screen.getByText('New Watchlist'));
		await userEvent.type(
			screen.getByTestId('new-watchlist-input'),
			'New Watchlist'
		);

		await userEvent.click(screen.getByText('OK'));
		await waitFor(() =>
			expect(screen.queryByText(/Add .* to Watchlist/)).not.toBeVisible()
		);

		await userEvent.click(screen.getByText('Investment Info'));
		await waitFor(() =>
			expect(screen.queryByText('New Watchlist')).toBeVisible()
		);
		await userEvent.click(screen.getByText('New Watchlist'));
		await waitFor(() => expect(screen.getByText(/\(MSFT\)/)).toBeVisible());
	});

	it('removes watchlist', async () => {
		renderApp({
			initialPath: '/market-tracker/investments'
		});
		await waitFor(() =>
			expect(screen.queryByText('Watchlists')).toBeVisible()
		);
		await waitFor(() =>
			expect(screen.queryAllByText('Remove')).toHaveLength(2)
		);
		expect(screen.getByText('First Watchlist')).toBeVisible();
		expect(screen.getByText('Second Watchlist')).toBeVisible();

		await userEvent.click(screen.getAllByText('Remove')[0]);
		await waitFor(() =>
			expect(
				screen.queryByText(
					'Are you sure you want to remove watchlist "First Watchlist"'
				)
			).toBeVisible()
		);
		await userEvent.click(screen.getByText('OK'));

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
			initialPath: '/market-tracker/investments'
		});
		await waitFor(() =>
			expect(screen.queryByText('Watchlists')).toBeVisible()
		);
		await waitFor(() =>
			expect(screen.queryAllByText('Remove')).toHaveLength(2)
		);
		expect(screen.queryByText('Add')).toBeVisible();

		await userEvent.click(screen.getByText('Add'));

		await waitFor(() =>
			expect(screen.queryByText('Add Watchlist')).toBeVisible()
		);

		await userEvent.type(screen.getByLabelText('Name'), 'New Watchlist');
		await userEvent.click(screen.getByText('OK'));

		await waitFor(() =>
			expect(screen.queryByText('Add Watchlist')).not.toBeVisible()
		);
		await waitFor(() =>
			expect(screen.queryByText('New Watchlist')).toBeVisible()
		);
		expect(screen.queryAllByText('Remove')).toHaveLength(3);
	});
});
