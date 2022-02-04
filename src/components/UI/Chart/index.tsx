import { Line } from '@ant-design/charts';
import { MarketData } from '../../../types/MarketData';
import { useMemo } from 'react';
import { HistoryRecord } from '../../../types/history';
import { match, when } from 'ts-pattern';

interface Props {
	readonly data: MarketData;
}

// TODO xField changes from date to time
// TODO color changes based on balance being up or down
// TODO figure out if it's possible to have dedicated data format type
// TODO need to factor in the time for the timesales setup

const getLastPrice = (
	history: ReadonlyArray<HistoryRecord>,
	index: number
): number =>
	match(index)
		.with(
			when<number>((_) => _ >= 0),
			() => history[index].price
		)
		.otherwise(() => history[index + 1].price);

// TODO need to make everything based on the change from the start, not the change from the last

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const formatData = (data: MarketData): Record<string, any>[] => [
	...data.history.map((record, index, array) => ({
		date: `${record.date} ${record.time}`,
		change: record.price - getLastPrice(array, index - 1)
	})),
	{
		date: 'Now',
		change:
			data.currentPrice -
			getLastPrice(data.history, data.history.length - 1)
	}
];

export const Chart = (props: Props) => {
	console.log('BeforeData', props.data);
	const data = useMemo(() => formatData(props.data), [props.data]);
	console.log('AfterData', data);

	return (
		<div>
			<Line
				height={200}
				padding="auto"
				xField="date"
				yField="change"
				data={data}
				color="green"
			/>
		</div>
	);
};
