import { Line } from '@ant-design/charts';
import { MarketData } from '../../../types/MarketData';
import { castDraft } from 'immer';
import { getFirstPrice } from './chartUtils';
import { useFormattedChartData } from './useFormattedChartData';
import { InvestmentData } from '../../../services/MarketInvestmentService';

interface Props {
	readonly data: InvestmentData;
}

export const Chart = (props: Props) => {
	const data = useFormattedChartData(props.data);
	const isGain =
		props.data.currentPrice - getFirstPrice(props.data.history) >= 0;

	return (
		<div>
			<Line
				height={250}
				padding="auto"
				xField="date"
				yField="change"
				data={castDraft(data)}
				color={isGain ? 'green' : 'red'}
			/>
		</div>
	);
};
