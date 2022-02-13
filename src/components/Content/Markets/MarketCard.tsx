import { MarketData } from '../../../types/MarketData';
import { Card } from 'antd';
import { CaretDownFilled, CaretUpFilled } from '@ant-design/icons';
import { ReactNode, useContext } from 'react';
import { match, when } from 'ts-pattern';
import {
	getFiveYearDisplayStartDate,
	getOneMonthDisplayStartDate,
	getOneWeekDisplayStartDate,
	getOneYearDisplayStartDate,
	getThreeMonthDisplayStartDate,
	getTodayDisplayDate
} from '../../../utils/timeUtils';
import { Chart as ChartComp } from '../../UI/Chart';
import './MarketCard.scss';
import { ScreenContext } from '../../ScreenContext';
import { getBreakpointName } from '../../utils/Breakpoints';
import { MarketTime } from '../../../types/MarketTime';
import { MarketStatus } from '../../../types/MarketStatus';
import { isStock } from '../../../data/InvestmentInfo';

interface Props {
	readonly data: MarketData;
	readonly marketStatus: MarketStatus;
	readonly time: MarketTime;
}

const createTitle = (data: MarketData): ReactNode => (
	<h3>
		<strong>{`${data.name} (${data.symbol})`}</strong>
	</h3>
);

const localeOptions: Intl.NumberFormatOptions = {
	minimumFractionDigits: 2,
	maximumFractionDigits: 2
};

const createPrice = (data: MarketData) => {
	const oldestPrice = data.history[0]?.price ?? 0;
	const priceChange = data.currentPrice - oldestPrice;

	const formattedPrice = `$${data.currentPrice.toLocaleString(
		undefined,
		localeOptions
	)}`;
	const priceChangeOperator = priceChange >= 0 ? '+' : '-';
	const formattedPriceChange = `${priceChangeOperator}$${Math.abs(
		priceChange
	).toLocaleString(undefined, localeOptions)}`;
	const percentChange = (Math.abs(priceChange) / oldestPrice) * 100;
	const formattedPercentChange = `${priceChangeOperator}${percentChange.toLocaleString(
		undefined,
		localeOptions
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
			MarketTime.ONE_DAY,
			(): TimeInfo => ({
				label: 'Today',
				sinceDate: getTodayDisplayDate()
			})
		)
		.with(
			MarketTime.ONE_WEEK,
			(): TimeInfo => ({
				label: '1 Week',
				sinceDate: getOneWeekDisplayStartDate()
			})
		)
		.with(
			MarketTime.ONE_MONTH,
			(): TimeInfo => ({
				label: '1 Month',
				sinceDate: getOneMonthDisplayStartDate()
			})
		)
		.with(
			MarketTime.THREE_MONTHS,
			(): TimeInfo => ({
				label: '3 Months',
				sinceDate: getThreeMonthDisplayStartDate()
			})
		)
		.with(
			MarketTime.ONE_YEAR,
			(): TimeInfo => ({
				label: '1 Year',
				sinceDate: getOneYearDisplayStartDate()
			})
		)
		.with(
			MarketTime.FIVE_YEARS,
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

export const MarketCard = ({ marketStatus, data, time }: Props) => {
	const Title = createTitle(data);
	const Time = createTime(time);
	const { breakpoints } = useContext(ScreenContext);
	const breakpointName = getBreakpointName(breakpoints);

	const { Price, Chart } = match({ marketStatus, type: data.type })
		.with(
			{ marketStatus: MarketStatus.CLOSED, type: when(isStock) },
			() => ({
				Price: MarketClosed,
				Chart: <div />
			})
		)
		.otherwise(() => ({
			Price: createPrice(data),
			Chart: <ChartComp data={data} />
		}));

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
			{Chart}
		</Card>
	);
};
