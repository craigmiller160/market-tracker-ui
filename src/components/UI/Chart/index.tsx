import { Line, LineConfig } from '@ant-design/charts';
import { MarketData } from '../../../types/MarketData';
import { useMemo } from 'react';

interface Props {
	readonly data: MarketData;
}

// TODO xField changes from date to time
// TODO color changes based on balance being up or down
// TODO figure out if it's possible to have dedicated data format type
// TODO need to factor in the time for the timesales setup

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const formatData = (data: MarketData): Record<string, any>[] => [
	...data.history.map((record) => ({
		date: record.date,
		price: record.price
	})),
	{
		date: 'Now',
		price: data.currentPrice
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
				yField="price"
				data={data}
				color="green"
			/>
		</div>
	);
};
