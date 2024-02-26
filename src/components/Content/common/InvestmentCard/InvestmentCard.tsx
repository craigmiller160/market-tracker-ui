import { Card, Typography } from 'antd';
import { CaretDownFilled, CaretUpFilled } from '@ant-design/icons';
import { type ReactNode } from 'react';
import { match, P } from 'ts-pattern';
import {
	getFiveYearDisplayStartDate,
	getOneMonthDisplayStartDate,
	getOneWeekDisplayStartDate,
	getOneYearDisplayStartDate,
	getThreeMonthDisplayStartDate,
	getTodayDisplayDate
} from '../../../../utils/timeUtils';
import './InvestmentCard.scss';
import { MarketTime } from '../../../../types/MarketTime';
import { MarketStatus } from '../../../../types/MarketStatus';
import { useSelector } from 'react-redux';
import { timeValueSelector } from '../../../../store/marketSettings/selectors';
import { Chart as ChartComp } from '../../../UI/Chart';
import { type InvestmentInfo } from '../../../../types/data/InvestmentInfo';
import { Spinner } from '../../../UI/Spinner';
import { useBreakpointName } from '../../../utils/Breakpoints';
import { type InvestmentData } from '../../../../types/data/InvestmentData';
import { useInvestmentCardDataLoadingContext } from './InvestmentCardDataLoadingContext';

interface Props {
	readonly info: InvestmentInfo;
	readonly getActions?: (symbol: string) => ReactNode[];
}

const createTitle = (
	info: InvestmentInfo,
	data: InvestmentData | undefined
): ReactNode => (
	<div className="title">
		<h3>
			<strong>{`(${info.symbol}) ${data?.name ?? ''}`}</strong>
		</h3>
	</div>
);

const localeOptions: Intl.NumberFormatOptions = {
	minimumFractionDigits: 2,
	maximumFractionDigits: 2
};

const gt0 = (value: number) => value > 0;

const createPrice = (data: InvestmentData, status: MarketStatus) => {
	const oldestPrice = data.startPrice;
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
	const priceClassName = match({ priceChange, status })
		.with({ status: MarketStatus.CLOSED }, () => '')
		.with({ priceChange: P.when(gt0) }, () => 'up')
		.otherwise(() => 'down');
	const ChangeIcon =
		priceChange >= 0 ? <CaretUpFilled /> : <CaretDownFilled />;

	return (
		<p className={priceClassName}>
			<span className="price">
				<span>
					{status !== MarketStatus.CLOSED && (
						<span className="Icon">{ChangeIcon}</span>
					)}
					{formattedPrice}{' '}
				</span>
				{status !== MarketStatus.CLOSED && (
					<span>
						({formattedPriceChange}, {formattedPercentChange})
					</span>
				)}
			</span>
		</p>
	);
};

const MarketClosed = <p>Market Closed</p>;

interface TimeInfo {
	readonly label: string;
	readonly sinceDate: string;
}

const createTime = (time: MarketTime): ReactNode => {
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
		<div className="time">
			<h3>{timeInfo.label}</h3>
			<p>Since {timeInfo.sinceDate}</p>
		</div>
	);
};

const createErrorMessage = (error: Error): ReactNode => (
	<Typography.Title className="ErrorMsg" level={3}>
		Error: {error.message}
	</Typography.Title>
);

const createMarketClosed = (data: InvestmentData): ReactNode => (
	<div>
		{createPrice(data, MarketStatus.CLOSED)}
		{MarketClosed}
	</div>
);

/* eslint-disable @typescript-eslint/no-non-null-assertion */
const getPriceAndBody = (
	status: MarketStatus,
	respectMarketStatus: boolean,
	loading: boolean,
	error: Error | undefined,
	data: InvestmentData | undefined
): { Price: ReactNode; Body: ReactNode } =>
	match({
		status,
		respectMarketStatus,
		loading,
		error,
		data
	})
		.with({ status: MarketStatus.UNKNOWN }, () => ({
			Price: <div />,
			Body: <div />
		}))
		.with({ loading: true }, () => ({
			Price: <div />,
			Body: <Spinner />
		}))
		.with({ error: P.not(undefined) }, ({ error: errorInfo }) => ({
			Price: <div />,
			Body: createErrorMessage(errorInfo)
		}))
		.with({ data: P.nullish }, () => ({
			Price: <div />,
			Body: <div />
		}))
		.with(
			{ status: MarketStatus.CLOSED, respectMarketStatus: true },
			() => ({
				Price: createMarketClosed(data!),
				Body: <div />
			})
		)
		.otherwise(() => ({
			Price: createPrice(data!, MarketStatus.OPEN),
			Body: <ChartComp data={data!} />
		}));
/* eslint-enable @typescript-eslint/no-non-null-assertion */

export const InvestmentCard = (props: Props) => {
	const { info, getActions = () => [] } = props;
	const breakpointName = useBreakpointName();
	const time = useSelector(timeValueSelector);
	const Time = createTime(time);
	// const { respectMarketStatus, status, loading, error, data } =
	// 	useGetInvestmentData(info);
	const useLoadInvestmentData = useInvestmentCardDataLoadingContext();
	const { respectMarketStatus, status, loading, error, data } =
		useLoadInvestmentData(info);

	const { Price, Body } = getPriceAndBody(
		status,
		respectMarketStatus,
		loading,
		error,
		data
	);

	const Title = createTitle(info, data);

	const FullTitle = (
		<>
			{Title}
			{Price}
		</>
	);

	return (
		<Card
			title={FullTitle}
			extra={Time}
			className={`investment-card ${breakpointName}`}
			role="listitem"
			data-testid={`market-card-${info.symbol}`}
			actions={!loading && !error ? getActions(info.symbol) : []}
		>
			{Body}
		</Card>
	);
};
