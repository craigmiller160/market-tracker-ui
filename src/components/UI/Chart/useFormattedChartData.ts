import * as Time from '@craigmiller160/ts-functions/es/Time';
import { pipe } from 'fp-ts/es6/function';
import * as RArray from 'fp-ts/es6/ReadonlyArray';
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

type ChartData = {
	readonly records: ReadonlyArray<ChartRecord>;
	readonly minPrice: number;
	readonly maxPrice: number;
};

const formatData = (data: InvestmentData): ChartData => {
	const firstPrice = getFirstPrice(data.history);
	const records = pipe(
		data.history,
		RArray.map((record) => ({
			date: formatHistoryDate(`${record.date} ${record.time}`),
			change: record.price - firstPrice,
			price: record.price
		})),
		RArray.append({
			date: 'Now',
			change: data.currentPrice - firstPrice,
			price: data.currentPrice
		})
	);

	const sortedByPrice = sortRecordsByPrice(records);

	return {
		minPrice: sortedByPrice[0].price,
		records,
		maxPrice: sortedByPrice[sortedByPrice.length - 1].price
	};
};

export const useFormattedChartData = (data: InvestmentData): ChartData =>
	useMemo(() => formatData(data), [data]);
