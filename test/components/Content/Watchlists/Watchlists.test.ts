import { ApiServer, newApiServer } from '../../../testutils/server';
import { renderApp } from '../../../testutils/RenderApp';
import { waitFor, within } from '@testing-library/react';
import { screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import userEvent from '@testing-library/user-event';

const PRICE_REGEX = /\$\d+\.\d{2}/;

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

		const vtiCard = screen.getByTestId('market-card-VTI');
		expect(within(vtiCard).queryByText(/VTI/)).toHaveTextContent(
			'My Stock (VTI)'
		);
		const vtiPriceNodes = within(vtiCard).getAllByText(PRICE_REGEX);
		expect(vtiPriceNodes).toHaveLength(2);
		expect(vtiPriceNodes[0]).toHaveTextContent('$100.00');

		const vooCard = screen.getByTestId('market-card-VOO');
		expect(within(vooCard).queryByText(/VOO/)).toHaveTextContent(
			'My Stock (VOO)'
		);
		const vooPriceNodes = within(vooCard).getAllByText(PRICE_REGEX);
		expect(vooPriceNodes).toHaveLength(2);
		expect(vooPriceNodes[0]).toHaveTextContent('$101.00');
	});

	it('renames a watchlist', async () => {
		throw new Error();
	});
});
