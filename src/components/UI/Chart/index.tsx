import { Line } from '@ant-design/charts';
import { castDraft } from 'immer';
import { getFirstPrice } from './chartUtils';
import { useFormattedChartData } from './useFormattedChartData';
import { InvestmentData } from '../../../types/data/InvestmentData';

interface Props {
	readonly data: InvestmentData;
}

const localeOptions: Intl.NumberFormatOptions = {
	minimumFractionDigits: 2,
	maximumFractionDigits: 2
};

export const Chart = (props: Props) => {
	const { records, minPrice, maxPrice } = useFormattedChartData(props.data);
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
					min: minPrice,
					max: maxPrice,
					label: {
						formatter: (text) => {
							return parseFloat(text).toLocaleString(
								undefined,
								localeOptions
							);
						}
					}
				}}
				data={castDraft(records)}
				color={isGain ? 'green' : 'red'}
			/>
		</div>
	);
};
