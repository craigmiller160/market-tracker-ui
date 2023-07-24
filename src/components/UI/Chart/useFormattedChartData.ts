import * as Time from '@craigmiller160/ts-functions/es/Time';
import { pipe } from 'fp-ts/function';
import * as RArray from 'fp-ts/ReadonlyArray';
import { getFirstPrice } from './chartUtils';
import { useMemo } from 'react';
import { InvestmentData } from '../../../types/data/InvestmentData';

const parseTableDate = Time.parse('yyyy-MM-dd HH:mm:ss');
const formatTableDate = Time.format("M/d/yy'\n'HH:mm");

export interface ChartRecord {
	readonly date: string;
	readonly change: number;
	readonly price: number;
}

const sortRecordsByPrice: (
	records: ReadonlyArray<ChartRecord>
) => ReadonlyArray<ChartRecord> = RArray.sort<ChartRecord>({
	compare: (a, b) => {
		if (a.price > b.price) {
			return 1;
		} else if (a.price < b.price) {
			return -1;
		} else {
			return 0;
		}
	},
	equals: (a, b) => {
		return a.price === b.price;
	}
});

const formatHistoryDate = (tableDate: string): string =>
	pipe(parseTableDate(tableDate), formatTableDate);

export type ChartData = {
	readonly records: ReadonlyArray<ChartRecord>;
	readonly minPrice: number;
	readonly maxPrice: number;
	readonly firstPrice: number;
};

const round = (value: number): number =>
	Math.round(value * 100 + Number.EPSILON) / 100;

const formatData = (data: InvestmentData): ChartData => {
	const firstPrice = getFirstPrice(data.history);
	const records = pipe(
		data.history,
		RArray.map(
			(record): ChartRecord => ({
				date: formatHistoryDate(`${record.date} ${record.time}`),
				change: round(record.price - firstPrice),
				price: round(record.price)
			})
		),
		RArray.append({
			date: 'Now',
			change: round(data.currentPrice - firstPrice),
			price: round(data.currentPrice)
		})
	);

	const sortedByPrice = sortRecordsByPrice(records);

	return {
		firstPrice,
		minPrice: sortedByPrice[0].price,
		records,
		maxPrice: sortedByPrice[sortedByPrice.length - 1].price
	};
};

export const useFormattedChartData = (data: InvestmentData): ChartData =>
	useMemo(() => formatData(data), [data]);
