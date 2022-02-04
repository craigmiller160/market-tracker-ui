import { MarketData } from '../../../types/MarketData';
import { Card } from 'antd';
import { CaretDownFilled, CaretUpFilled } from '@ant-design/icons';
import { ReactNode } from 'react';
import { match } from 'ts-pattern';
import {
	getFiveYearDisplayStartDate,
	getOneMonthDisplayStartDate,
	getOneWeekDisplayStartDate,
	getOneYearDisplayStartDate,
	getThreeMonthDisplayStartDate,
	getTodayDisplayDate
} from '../../../utils/timeUtils';

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

interface TimeInfo {
	readonly label: string;
	readonly sinceDate: string;
}

const createTime = (time: string): ReactNode => {
	const timeInfo: TimeInfo = match(time)
		.with(
			'oneDay',
			(): TimeInfo => ({
				label: 'Today',
				sinceDate: getTodayDisplayDate()
			})
		)
		.with(
			'oneWeek',
			(): TimeInfo => ({
				label: '1 Week',
				sinceDate: getOneWeekDisplayStartDate()
			})
		)
		.with(
			'oneMonth',
			(): TimeInfo => ({
				label: '1 Month',
				sinceDate: getOneMonthDisplayStartDate()
			})
		)
		.with(
			'threeMonths',
			(): TimeInfo => ({
				label: '3 Months',
				sinceDate: getThreeMonthDisplayStartDate()
			})
		)
		.with(
			'oneYear',
			(): TimeInfo => ({
				label: '1 Year',
				sinceDate: getOneYearDisplayStartDate()
			})
		)
		.with(
			'fiveYears',
			(): TimeInfo => ({
				label: '5 Years',
				sinceDate: getFiveYearDisplayStartDate()
			})
		)
		.run();

	return (
		<div className="Time">
			<h3>{timeInfo.label}</h3>
			<p>Since {timeInfo.sinceDate}</p>
		</div>
	);
};

export const MarketCard = ({ data, time }: Props) => {
	const Title = createTitle(data);
	const Time = createTime(time);
	return (
		<Card
			title={Title}
			className="MarketCard"
			extra={Time}
			data-testid="market-card"
		>
			<p>Chart Goes Here</p>
		</Card>
	);
};
