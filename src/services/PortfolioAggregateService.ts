import type { SharesOwnedResponse } from '../types/generated/market-tracker-portfolio-service';
import { getCurrentSharesForStockInPortfolio } from './PortfolioService';

export type AggregateSharesOwnedResponse = SharesOwnedResponse &
	Readonly<{
		symbol: string;
	}>;

export const getAggregateCurrentSharesForStocksInPortfolio = (
	portfolioId: string,
	symbols: ReadonlyArray<string>,
	signal: AbortSignal
): Promise<ReadonlyArray<AggregateSharesOwnedResponse>> => {
	const promises = symbols.map((symbol) =>
		getCurrentSharesForStockInPortfolio(portfolioId, symbol, signal).then(
			(res): AggregateSharesOwnedResponse => ({
				...res,
				symbol
			})
		)
	);
	return Promise.all(promises);
};
