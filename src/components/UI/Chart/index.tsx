import { Line } from '@ant-design/charts';
import { MarketData } from '../../../types/MarketData';
import { useMemo } from 'react';
import { flow, pipe } from 'fp-ts/es6/function';
import * as RArray from 'fp-ts/es6/ReadonlyArray';
import * as Option from 'fp-ts/es6/Option';
import * as Time from '@craigmiller160/ts-functions/es/Time';
import { HistoryRecord } from '../../../types/history';
import { castDraft } from 'immer';

// TODO move all data handling logic into custom hook that can be tested separately because of difficulty doing integration tests

const parseTableDate = Time.parse('yyyy-MM-dd HH:mm:ss');
const formatTableDate = Time.format("M/d/yy'\n'HH:mm");

interface Props {
	readonly data: MarketData;
}

interface ChartRecord {
	readonly date: string;
	readonly change: number;
}

// TODO figure out if it's possible to have dedicated data format type

const formatHistoryDate = (tableDate: string): string =>
	pipe(parseTableDate(tableDate), formatTableDate);

const getFirstPrice: (history: ReadonlyArray<HistoryRecord>) => number = flow(
	RArray.head,
	Option.fold(
		() => 0,
		(_) => _.price
	)
);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
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

export const Chart = (props: Props) => {
	const data = useMemo(() => formatData(props.data), [props.data]);
	const isGain =
		props.data.currentPrice - getFirstPrice(props.data.history) >= 0;

	return (
		<div>
			<Line
				height={200}
				padding="auto"
				xField="date"
				yField="change"
				data={castDraft(data)}
				color={isGain ? 'green' : 'red'}
			/>
		</div>
	);
};
