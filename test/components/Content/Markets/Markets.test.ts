import { screen, within } from '@testing-library/react';
import MockAdapter from 'axios-mock-adapter';
import { ajaxApi } from '../../../../src/services/AjaxApi';
import { createRenderApp } from '../../../testutils/RenderApp';
import '@testing-library/jest-dom/extend-expect';
import { TradierQuotes } from '../../../../src/types/tradier/quotes';
import { menuItemIsSelected } from '../../../testutils/menuUtils';

const mockApi = new MockAdapter(ajaxApi.instance);
const renderApp = createRenderApp(mockApi);

const mockQuote: TradierQuotes = {
	quotes: {
		quote: {
			symbol: 'VTI',
			description: '',
			open: 0,
			high: 0,
			low: 0,
			bid: 0,
			ask: 0,
			close: 0,
			last: 100
		}
	}
};

describe('Markets', () => {
	beforeEach(() => {
		mockApi.reset();
	});

	it('renders for today', async () => {
		mockApi
			.onGet('/tradier/markets/quotes?symbols=VTI')
			.reply(200, mockQuote);
		await renderApp();
		menuItemIsSelected('Today');

		const marketsPage = screen.getByTestId('markets-page');
		const marketCards = within(marketsPage).queryAllByTestId('market-card');
		expect(marketCards).toHaveLength(1);

		const vtiCard = marketCards[0];
		expect(
			within(vtiCard).queryByText('US Total Market (VTI)')
		).toBeInTheDocument();
		expect(within(vtiCard).queryByText('Today')).toBeInTheDocument();
		const amountItem = within(vtiCard).queryByText(/\$100\.00/);
		expect(amountItem?.textContent).toEqual('$100.00 (+$100.00, +100.00%)');
		expect(
			within(vtiCard).queryByText('Chart Goes Here')
		).toBeInTheDocument();
	});

	it('renders for 1 week', async () => {
		throw new Error();
	});

	it('renders for 1 month', async () => {
		throw new Error();
	});

	it('renders for 3 months', async () => {
		throw new Error();
	});

	it('renders for 1 year', async () => {
		throw new Error();
	});

	it('renders for 5 years', async () => {
		throw new Error();
	});
});
