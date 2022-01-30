import { MarketData } from './MarketData';
import { Card } from 'antd';

interface Props {
	readonly data: MarketData;
}

const createTitle = (data: MarketData) => {
	const oldestPrice = data.history[0]?.price ?? 0;
	const priceChange = data.currentPrice - oldestPrice;

	const formattedPrice = `$${data.currentPrice.toFixed(2)}`;
	const priceChangeOperator = priceChange >= 0 ? '+' : '-';
	const formattedPriceChange = `${priceChangeOperator}$${Math.abs(
		priceChange
	).toFixed(2)}`;
	const percentChange = (Math.abs(priceChange) / data.currentPrice) * 100;
	const formattedPercentChange = `${priceChangeOperator}${percentChange.toFixed(
		2
	)}%`;
	const priceClassName = priceChange >= 0 ? 'up' : 'down';

	return (
		<>
			<h3>
				<strong>{`${data.name} (${data.symbol})`}</strong>
			</h3>
			<p className={priceClassName}>
				{formattedPrice} ({formattedPriceChange},{' '}
				{formattedPercentChange})
			</p>
		</>
	);
};

// TODO add arrow for increase/decrease
// TODO color price for increase/decrease
export const MarketCard = ({ data }: Props) => {
	const title = createTitle(data);
	return (
		<Card title={title} className="MarketCard">
			<p>Chart Goes Here</p>
		</Card>
	);
};
