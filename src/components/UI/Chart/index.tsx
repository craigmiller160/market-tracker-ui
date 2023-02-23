import { Line } from '@ant-design/charts';
import { castDraft } from 'immer';
import { getFirstPrice } from './chartUtils';
import { useFormattedChartData } from './useFormattedChartData';
import { InvestmentData } from '../../../types/data/InvestmentData';

interface Props {
	readonly data: InvestmentData;
}

export const Chart = (props: Props) => {
	const { records, firstPrice, currentPrice } = useFormattedChartData(
		props.data
	);
	const isGain =
		props.data.currentPrice - getFirstPrice(props.data.history) >= 0;

	return (
		<div>
			<Line
				height={250}
				padding="auto"
				xField="date"
				yField="price"
				yAxis={{
					min: firstPrice - 1,
					max: currentPrice + 1
				}}
				data={castDraft(records)}
				color={isGain ? 'green' : 'red'}
			/>
		</div>
	);
};
