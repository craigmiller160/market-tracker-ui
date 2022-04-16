import { ApiServer, newApiServer } from '../../../testutils/server';
import { renderApp } from '../../../testutils/RenderApp';
import { waitFor } from '@testing-library/react';
import { screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

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
	});

	it('renames a watchlist', async () => {
		throw new Error();
	});
});
