import { MarketData } from '../../../../src/types/MarketData';
import { render } from '@testing-library/react';
import {
	ChartRecord,
	useFormattedChartData
} from '../../../../src/components/UI/Chart/useFormattedChartData';

const marketData: MarketData = {
	symbol: 'VTI',
	name: 'Total Index Fund',
	currentPrice: 100,
	isInternational: false,
	history: [
		{
			date: '2022-01-01',
			time: '00:00:00',
			price: 10,
			unixTimestampMillis: 0
		},
		{
			date: '2022-01-01',
			time: '23:59:59',
			price: 15,
			unixTimestampMillis: 0
		},
		{
			date: '2022-01-02',
			time: '00:00:00',
			price: 21,
			unixTimestampMillis: 0
		},
		{
			date: '2022-01-02',
			time: '23:59:59',
			price: 17,
			unixTimestampMillis: 0
		},
		{
			date: '2022-01-03',
			time: '00:00:00',
			price: 28,
			unixTimestampMillis: 0
		}
	]
};

interface Props {
	readonly data: MarketData;
	readonly callback: (result: ReadonlyArray<ChartRecord>) => void;
}

const TestComp = (props: Props) => {
	const result = useFormattedChartData(props.data);
	props.callback(result);

	return <div />;
};

describe('useFormattedChartData', () => {
	it('formats the chart data', () => {
		let result: ReadonlyArray<ChartRecord> = [];
		const callback = (r: ReadonlyArray<ChartRecord>) => {
			result = r;
		};
		render(<TestComp data={marketData} callback={callback} />);
		expect(result).toEqual([]);
	});
});
