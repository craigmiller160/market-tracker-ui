import type { SharesOwnedResponse } from '../types/generated/market-tracker-portfolio-service';
import {
	getCurrentSharesForStockInPortfolio,
	getSharesHistoryForStockInPortfolio
} from './PortfolioService';
import type { MarketTime } from '../types/MarketTime';

export type AggregateCurrentSharesOwnedResponse = Readonly<
	Record<string, SharesOwnedResponse>
>;
export type AggregateSharesOwnedHistoryResponse = Readonly<
	Record<string, ReadonlyArray<SharesOwnedResponse>>
>;

export const getAggregateCurrentSharesForStocksInPortfolio = async (
	portfolioId: string,
	symbols: ReadonlyArray<string>,
	signal?: AbortSignal
): Promise<AggregateCurrentSharesOwnedResponse> => {
	const promises = symbols.map((symbol) =>
		getCurrentSharesForStockInPortfolio(portfolioId, symbol, signal).then(
			(res): AggregateCurrentSharesOwnedResponse => ({
				[symbol]: res
			})
		)
	);
	const responses = await Promise.all(promises);
	return responses.reduce<AggregateCurrentSharesOwnedResponse>(
		(acc, res) => ({
			...acc,
			...res
		}),
		{}
	);
};

export const getAggregateSharesHistoryForStocksInPortfolio = async (
	portfolioId: string,
	symbols: ReadonlyArray<string>,
	time: MarketTime,
	signal?: AbortSignal
): Promise<AggregateSharesOwnedHistoryResponse> => {
	const promises = symbols.map((symbol) =>
		getSharesHistoryForStockInPortfolio(
			portfolioId,
			symbol,
			time,
			signal
		).then(
			(res): AggregateSharesOwnedHistoryResponse => ({
				[symbol]: res
			})
		)
	);
	const responses = await Promise.all(promises);
	return responses.reduce<AggregateSharesOwnedHistoryResponse>(
		(acc, res) => ({
			...acc,
			...res
		}),
		{}
	);
};
