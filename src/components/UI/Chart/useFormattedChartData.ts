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

const formatHistoryDate = (tableDate: string): string =>
	pipe(parseTableDate(tableDate), formatTableDate);

type ChartData = {
	readonly records: ReadonlyArray<ChartRecord>;
	readonly firstPrice: number;
	readonly currentPrice: number;
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
	return {
		firstPrice,
		records,
		currentPrice: data.currentPrice
	};
};

export const useFormattedChartData = (data: InvestmentData): ChartData =>
	useMemo(() => formatData(data), [data]);
