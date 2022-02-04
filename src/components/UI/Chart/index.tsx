import { Line } from '@ant-design/charts';
import { MarketData } from '../../../types/MarketData';
import { useMemo } from 'react';
import { pipe } from 'fp-ts/es6/function';
import * as RArray from 'fp-ts/es6/ReadonlyArray';
import * as Option from 'fp-ts/es6/Option';
import * as Time from '@craigmiller160/ts-functions/es/Time';

const parseTableDate = Time.parse('yyyy-MM-dd HH:mm:ss');
const formatTableDate = Time.format("M/d/yy'\n'HH:mm");

interface Props {
	readonly data: MarketData;
}

// TODO color changes based on balance being up or down
// TODO figure out if it's possible to have dedicated data format type

const formatHistoryDate = (tableDate: string): string =>
	pipe(parseTableDate(tableDate), formatTableDate);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const formatData = (data: MarketData): ReadonlyArray<Record<string, any>> => {
	const firstPrice = pipe(
		RArray.head(data.history),
		Option.fold(
			() => 0,
			(_) => _.price
		)
	);
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

	// TODO fix casting

	return (
		<div>
			<Line
				height={200}
				padding="auto"
				xField="date"
				yField="change"
				data={data as Record<string, any>[]} // eslint-disable-line
				color="green"
			/>
		</div>
	);
};
