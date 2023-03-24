import { render } from '@testing-library/react';
import {
	ChartData,
	useFormattedChartData
} from '../../../../src/components/UI/Chart/useFormattedChartData';
import { InvestmentData } from '../../../../src/types/data/InvestmentData';

const marketData: InvestmentData = {
	currentPrice: 50,
	name: '',
	startPrice: 12,
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
	readonly data: InvestmentData;
	readonly callback: (result: ChartData) => void;
}

const TestComp = (props: Props) => {
	const result = useFormattedChartData(props.data);
	props.callback(result);

	return <div />;
};

describe('useFormattedChartData', () => {
	it('formats the chart data', () => {
		let result: ChartData = {
			records: [],
			minPrice: 0,
			maxPrice: 0,
			firstPrice: 0
		};
		const callback = (r: ChartData) => {
			result = r;
		};
		render(<TestComp data={marketData} callback={callback} />);
		expect(result).toEqual({
			minPrice: 10,
			maxPrice: 50,
			records: [
				{
					date: '1/1/22\n00:00',
					change: 0,
					price: 10
				},
				{
					date: '1/1/22\n23:59',
					change: 5,
					price: 15
				},
				{
					date: '1/2/22\n00:00',
					change: 11,
					price: 21
				},
				{
					date: '1/2/22\n23:59',
					change: 7,
					price: 17
				},
				{
					date: '1/3/22\n00:00',
					change: 18,
					price: 28
				},
				{
					date: 'Now',
					change: 40,
					price: 50
				}
			]
		});
	});
});
