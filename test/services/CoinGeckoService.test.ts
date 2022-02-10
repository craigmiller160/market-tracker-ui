import { CoinGeckoPrice } from '../../src/types/coingecko/CoinGeckoPrice';
import { ajaxApi } from '../../src/services/AjaxApi';
import MockAdapter from 'axios-mock-adapter';
import '@relmify/jest-fp-ts';
import { getQuotes } from '../../src/services/CoinGeckoService';

const symbols: ReadonlyArray<string> = ['bitcoin', 'ethereum'];

const price: CoinGeckoPrice = {
	bitcoin: {
		usd: '100.50'
	},
	ethereum: {
		usd: '50.75'
	}
};

const mockApi = new MockAdapter(ajaxApi.instance);

describe('CoinGeckoService', () => {
	beforeEach(() => {
		mockApi.reset();
	});

	it('gets quotes for currencies', async () => {
		mockApi
			.onGet(
				`/coingecko/simple/price?ids=${symbols.join(
					','
				)}&vs_currencies=usd`
			)
			.reply(200, price);

		const result = await getQuotes(symbols)();
		expect(result).toEqualRight([
			{
				symbol: 'bitcoin',
				price: 100.5
			},
			{
				symbol: 'ethereum',
				price: 50.75
			}
		]);
	});

	it('gets history for today', async () => {
		throw new Error();
	});

	it('gets 1 week history', async () => {
		throw new Error();
	});

	it('gets 1 month history', async () => {
		throw new Error();
	});

	it('gets 3 months history', async () => {
		throw new Error();
	});

	it('gets 1 year history', async () => {
		throw new Error();
	});

	it('gets 5 years history', async () => {
		throw new Error();
	});
});
