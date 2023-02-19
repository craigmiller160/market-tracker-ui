import { HistoryTime } from './common';
import Chainable = Cypress.Chainable;
import { match } from 'ts-pattern';

const getCGSymbol = (symbol: string): string =>
	match(symbol)
		.with('BTC', () => 'bitcoin')
		.with('ETH', () => 'ethereum')
		.run();

const getPriceFixture = (symbol: string): string =>
	match(symbol)
		.with('BTC', () => 'coingecko_price_btc.json')
		.with('ETH', () => 'coingecko_price_eth.json')
		.run();

const getRangeFixture = (symbol: string, time: HistoryTime): string =>
	match({ symbol, time })
		.with(
			{ symbol: 'BTC', time: '1week' },
			() => 'coingecko_range_1week_btc.json'
		)
		.with(
			{ symbol: 'ETH', time: '1week' },
			() => 'coingecko_range_1week_eth.json'
		)
		.run();

const getCryptoData = (symbol: string, time: HistoryTime): Chainable<null> => {
	const cgSymbol = getCGSymbol(symbol);
	const priceFixture = getPriceFixture(symbol);
	const rangeFixture = getRangeFixture(symbol, time);
	return cy
		.intercept(
			`/market-tracker/api/coingecko/simple/price?ids=${cgSymbol}&vs_currencies=usd`,
			{
				fixture: priceFixture
			}
		)
		.as(`coingecko_getPrice_${symbol}`)
		.intercept(
			RegExp(
				`\\/market-tracker\\/api\\/coingecko\\/coins\\/${cgSymbol}\\/market_chart\\/range\\?vs_currency=usd&from=\\d+&to=\\d+`
			),
			{
				fixture: rangeFixture
			}
		)
		.as(`coingecko_getRange_${symbol}_${time}`);
};

export const coinGeckoApi = {
	getCryptoData
};
