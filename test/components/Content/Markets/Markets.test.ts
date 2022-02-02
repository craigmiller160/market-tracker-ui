import { screen } from '@testing-library/react';
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
			close: 100,
			last: 0
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
