import { MarketData } from '../../../types/MarketData';
import { Card } from 'antd';
import { CaretDownFilled, CaretUpFilled } from '@ant-design/icons';
import { ReactNode, useContext } from 'react';
import { match } from 'ts-pattern';
import {
	getFiveYearDisplayStartDate,
	getOneMonthDisplayStartDate,
	getOneWeekDisplayStartDate,
	getOneYearDisplayStartDate,
	getThreeMonthDisplayStartDate,
	getTodayDisplayDate
} from '../../../utils/timeUtils';
import { Chart } from '../../UI/Chart';
import './MarketCard.scss';
import { ScreenContext } from '../../ScreenContext';
import { getBreakpointName } from '../../utils/Breakpoints';

interface Props {
	readonly data: MarketData;
	readonly isMarketOpen: boolean;
	readonly time: string;
}

const createTitle = (data: MarketData): ReactNode => (
	<h3>
		<strong>{`${data.name} (${data.symbol})`}</strong>
	</h3>
);

const createPrice = (data: MarketData) => {
	const oldestPrice = data.history[0]?.price ?? 0;
	const priceChange = data.currentPrice - oldestPrice;

	const formattedPrice = `$${data.currentPrice.toFixed(2)}`;
	const priceChangeOperator = priceChange >= 0 ? '+' : '-';
	const formattedPriceChange = `${priceChangeOperator}$${Math.abs(
		priceChange
	).toFixed(2)}`;
	const percentChange = (Math.abs(priceChange) / oldestPrice) * 100;
	const formattedPercentChange = `${priceChangeOperator}${percentChange.toFixed(
		2
	)}%`;
	const priceClassName = priceChange >= 0 ? 'up' : 'down';
	const ChangeIcon =
		priceChange >= 0 ? <CaretUpFilled /> : <CaretDownFilled />;

	return (
		<p className={priceClassName}>
			<span className="Icon">{ChangeIcon}</span>
			{formattedPrice} ({formattedPriceChange}, {formattedPercentChange})
		</p>
	);
};

const MarketClosed = <p>Market Closed</p>;

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

export const MarketCard = ({ isMarketOpen, data, time }: Props) => {
	const Title = createTitle(data);
	const Price = match(isMarketOpen)
		.with(true, () => createPrice(data))
		.otherwise(() => MarketClosed);
	const Time = createTime(time);
	const { breakpoints } = useContext(ScreenContext);
	const breakpointName = getBreakpointName(breakpoints);

	const FullTitle = (
		<>
			{Title}
			{Price}
		</>
	);

	return (
		<Card
			title={FullTitle}
			className={`MarketCard ${breakpointName}`}
			extra={Time}
			role="listitem"
			data-testid={`market-card-${data.symbol}`}
		>
			<Chart data={data} />
		</Card>
	);
};
