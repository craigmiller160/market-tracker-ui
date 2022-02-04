import { MarketData } from '../../../types/MarketData';
import * as Time from '@craigmiller160/ts-functions/es/Time';
import { pipe } from 'fp-ts/es6/function';
import * as RArray from 'fp-ts/es6/ReadonlyArray';
import { getFirstPrice } from './chartUtils';
import { useMemo } from 'react';

const parseTableDate = Time.parse('yyyy-MM-dd HH:mm:ss');
const formatTableDate = Time.format("M/d/yy'\n'HH:mm");

export interface ChartRecord {
	readonly date: string;
	readonly change: number;
}

const formatHistoryDate = (tableDate: string): string =>
	pipe(parseTableDate(tableDate), formatTableDate);

const formatData = (data: MarketData): ReadonlyArray<ChartRecord> => {
	const firstPrice = getFirstPrice(data.history);
	return pipe(
		data.history,
		RArray.map((record) => ({
			date: formatHistoryDate(`${record.date} ${record.time}`),
			change: record.price - firstPrice
		})),
		RArray.append({
			date: 'Now',
			change: data.currentPrice - firstPrice
		})
	);
};

// TODO write tests

export const useFormattedChartData = (
	data: MarketData
): ReadonlyArray<ChartRecord> => useMemo(() => formatData(data), [data]);
