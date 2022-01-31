import { MarketData } from './MarketData';
import { Card } from 'antd';
import { CaretDownFilled, CaretUpFilled } from '@ant-design/icons';

interface Props {
	readonly data: MarketData;
	readonly time: string;
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
	const ChangeIcon =
		priceChange >= 0 ? <CaretUpFilled /> : <CaretDownFilled />;

	return (
		<>
			<h3>
				<strong>{`${data.name} (${data.symbol})`}</strong>
			</h3>
			<p className={priceClassName}>
				<span className="Icon">{ChangeIcon}</span>
				{formattedPrice} ({formattedPriceChange},{' '}
				{formattedPercentChange})
			</p>
		</>
	);
};

export const MarketCard = ({ data }: Props) => {
	const Title = createTitle(data);
	return (
		<Card title={Title} className="MarketCard">
			<p>Chart Goes Here</p>
		</Card>
	);
};
