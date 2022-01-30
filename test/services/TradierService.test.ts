import { ajaxApi } from '../../src/services/AjaxApi';
import MockAdapter from 'axios-mock-adapter';
import { TradierQuote } from '../../src/types/tradier/quotes';
import { getQuotes } from '../../src/services/TradierService';
import '@relmify/jest-fp-ts';

const mockApi = new MockAdapter(ajaxApi.instance);

const createQuote = (symbol: string): TradierQuote => ({
	symbol,
	description: '',
	open: 0,
	high: 1,
	low: 2,
	bid: 3,
	ask: 4,
	close: 5,
	last: 6
});

describe('TradierService', () => {
	beforeEach(() => {
		mockApi.reset();
	});

	it('get single quote', async () => {
		mockApi.onGet('/tradier/markets/quotes?symbols=VTI').reply(200, {
			quotes: {
				quote: createQuote('VTI')
			}
		});
		const result = await getQuotes(['VTI'])();
		expect(result).toEqualRight([createQuote('VTI')]);
	});

	it('get multiple quotes', async () => {
		mockApi.onGet('/tradier/markets/quotes?symbols=VTI,VOO').reply(200, {
			quotes: {
				quote: [createQuote('VTI'), createQuote('VOO')]
			}
		});
		const result = await getQuotes(['VTI', 'VOO'])();
		expect(result).toEqualRight([createQuote('VTI'), createQuote('VOO')]);
	});

	it('get 1 week history', async () => {
		throw new Error();
	});

	it('get 1 month history', async () => {
		throw new Error();
	});

	it('get 3 months history', async () => {
		throw new Error();
	});

	it('get 1 year history', async () => {
		throw new Error();
	});

	it('get 5 years history', async () => {
		throw new Error();
	});
});
