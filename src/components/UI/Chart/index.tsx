import { Line } from '@ant-design/plots';
import { MarketData } from '../../../types/MarketData';
import { useMemo } from 'react';

interface Props {
	readonly data: MarketData;
}

// TODO xField changes from date to time
// TODO color changes based on balance being up or down
// TODO figure out if it's possible to have dedicated data format type

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
	const data = useMemo(() => formatData(props.data), [props.data]);

	return (
		<div>
			<Line
				padding="auto"
				xField="date"
				yField="price"
				data={data}
				color="green"
			/>
		</div>
	);
};
