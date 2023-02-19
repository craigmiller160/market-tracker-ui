import { HistoryTime } from './common';
import Chainable = Cypress.Chainable;
import { match } from 'ts-pattern';

const getCGSymbol = (symbol: string): string =>
	match(symbol)
		.with('BTC', () => 'bitcoin')
		.with('ETH', () => 'ethereum')
		.run();

const getCryptoData = (symbol: string, time: HistoryTime): Chainable<null> => {
	const cgSymbol = getCGSymbol(symbol);
	return cy
		.intercept(
			`/market-tracker/api/coingecko/simple/price?ids=${cgSymbol}&vs_currencies=usd`
		)
		.as(`coingecko_getPrice_${symbol}`);
};

export const coinGeckoApi = {
	getCryptoData
};
