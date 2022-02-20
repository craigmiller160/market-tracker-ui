import { render } from '@testing-library/react';
import {
	ChartRecord,
	useFormattedChartData
} from '../../../../src/components/UI/Chart/useFormattedChartData';
import { InvestmentData } from '../../../../src/services/MarketInvestmentService';

const marketData: InvestmentData = {
	currentPrice: 50,
	history: [
		{
			date: '2022-01-01',
			marketSettings: '00:00:00',
			price: 10,
			unixTimestampMillis: 0
		},
		{
			date: '2022-01-01',
			marketSettings: '23:59:59',
			price: 15,
			unixTimestampMillis: 0
		},
		{
			date: '2022-01-02',
			marketSettings: '00:00:00',
			price: 21,
			unixTimestampMillis: 0
		},
		{
			date: '2022-01-02',
			marketSettings: '23:59:59',
			price: 17,
			unixTimestampMillis: 0
		},
		{
			date: '2022-01-03',
			marketSettings: '00:00:00',
			price: 28,
			unixTimestampMillis: 0
		}
	]
};

interface Props {
	readonly data: InvestmentData;
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
		expect(result).toEqual([
			{
				date: '1/1/22\n00:00',
				change: 0
			},
			{
				date: '1/1/22\n23:59',
				change: 5
			},
			{
				date: '1/2/22\n00:00',
				change: 11
			},
			{
				date: '1/2/22\n23:59',
				change: 7
			},
			{
				date: '1/3/22\n00:00',
				change: 18
			},
			{
				date: 'Now',
				change: 40
			}
		]);
	});
});
