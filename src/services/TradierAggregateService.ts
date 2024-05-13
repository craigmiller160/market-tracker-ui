import type { HistoryRecord } from '../types/history';
import type { MarketTime } from '../types/MarketTime';
import { getHistoryFn } from './ServiceSelectors';
import { InvestmentType } from '../types/data/InvestmentType';

export type AggregateHistoryRecord = Readonly<
	Record<string, ReadonlyArray<HistoryRecord>>
>;

export const getAggregateHistory = async (
	symbols: ReadonlyArray<string>,
	time: MarketTime,
	signal?: AbortSignal
): Promise<AggregateHistoryRecord> => {
	const historyFn = getHistoryFn(time, InvestmentType.STOCK);
	const promises = symbols.map((symbol) =>
		historyFn(symbol, signal).then(
			(res): AggregateHistoryRecord => ({
				[symbol]: res
			})
		)
	);
	const responses = await Promise.all(promises);
	return responses.reduce<AggregateHistoryRecord>(
		(acc, res) => ({
			...acc,
			...res
		}),
		{}
	);
};
