import type { HistoryRecord } from '../types/history';
import type { MarketTime } from '../types/MarketTime';
import { getHistoryFn } from './ServiceSelectors';
import { InvestmentType } from '../types/data/InvestmentType';

export type AggregateHistoryRecords = Readonly<
	Record<string, ReadonlyArray<HistoryRecord>>
>;

export const getAggregateHistory = async (
	symbols: ReadonlyArray<string>,
	time: MarketTime,
	signal?: AbortSignal
): Promise<AggregateHistoryRecords> => {
	const historyFn = getHistoryFn(time, InvestmentType.STOCK);
	const promises = symbols.map((symbol) =>
		historyFn(symbol, signal).then(
			(res): AggregateHistoryRecords => ({
				[symbol]: res
			})
		)
	);
	const responses = await Promise.all(promises);
	return responses.reduce<AggregateHistoryRecords>(
		(acc, res) => ({
			...acc,
			...res
		}),
		{}
	);
};
