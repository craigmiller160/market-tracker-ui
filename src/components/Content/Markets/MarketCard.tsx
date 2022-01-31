import { MarketData } from './MarketData';
import { Card } from 'antd';
import { CaretDownFilled, CaretUpFilled } from '@ant-design/icons';
import { ReactNode } from 'react';
import { match } from 'ts-pattern';

interface Props {
	readonly data: MarketData;
	readonly time: string;
}

const createTitle = (data: MarketData): ReactNode => {
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

const createTime = (time: string): ReactNode => {
	const timeLabel = match(time)
		.with('oneDay', () => 'Today')
		.with('oneWeek', () => '1 Week')
		.with('oneMonth', () => '1 Month')
		.with('threeMonths', () => '3 Months')
		.with('oneYear', () => '1 Year')
		.with('fiveYears', () => '5 Years')
		.run();
	return <h3>{timeLabel}</h3>;
};

export const MarketCard = ({ data, time }: Props) => {
	const Title = createTitle(data);
	const Time = createTime(time);
	return (
		<Card title={Title} className="MarketCard" extra={Time}>
			<p>Chart Goes Here</p>
		</Card>
	);
};
