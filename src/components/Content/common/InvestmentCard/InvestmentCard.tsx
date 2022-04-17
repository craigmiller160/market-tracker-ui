import { Card, Typography } from 'antd';
import { CaretDownFilled, CaretUpFilled } from '@ant-design/icons';
import { ReactNode, useContext } from 'react';
import { match, not, when } from 'ts-pattern';
import {
	getFiveYearDisplayStartDate,
	getOneMonthDisplayStartDate,
	getOneWeekDisplayStartDate,
	getOneYearDisplayStartDate,
	getThreeMonthDisplayStartDate,
	getTodayDisplayDate
} from '../../../../utils/timeUtils';
import './InvestmentCard.scss';
import { ScreenContext } from '../../../ScreenContext';
import { getBreakpointName } from '../../../utils/Breakpoints';
import { MarketTime } from '../../../../types/MarketTime';
import { MarketStatus } from '../../../../types/MarketStatus';
import { useSelector } from 'react-redux';
import {
	marketStatusSelector,
	timeValueSelector
} from '../../../../store/marketSettings/selectors';
import { InvestmentData } from '../../../../services/MarketInvestmentService';
import { Chart as ChartComp } from '../../../UI/Chart';
import { ErrorInfo, useInvestmentData } from '../../../hooks/useInvestmentData';
import { InvestmentInfo } from '../../../../types/data/InvestmentInfo';
import { getInvestmentNotFoundMessage } from '../../../../error/InvestmentNotFoundError';
import { Spinner } from '../../../UI/Spinner';

interface Props {
	readonly info: InvestmentInfo;
	readonly getActions?: (symbol: string) => ReactNode[];
}

const createTitle = (info: InvestmentInfo, data: InvestmentData): ReactNode => (
	<div className="Title">
		<h3>
			<strong>{`${data.name} (${info.symbol})`}</strong>
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
		.with({ priceChange: when(gt0) }, () => 'up')
		.otherwise(() => 'down');
	const ChangeIcon =
		priceChange >= 0 ? <CaretUpFilled /> : <CaretDownFilled />;

	return (
		<p className={priceClassName}>
			<span className="Price">
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
		<div className="Time">
			<h3>{timeInfo.label}</h3>
			<p>Since {timeInfo.sinceDate}</p>
		</div>
	);
};

const createErrorMessage = (error: ErrorInfo): ReactNode => {
	const message = match(error)
		.with({ name: 'InvestmentNotFoundError' }, getInvestmentNotFoundMessage)
		.otherwise(() => 'Unable to Get Data');
	return (
		<Typography.Title className="ErrorMsg" level={3}>
			Error: {message}
		</Typography.Title>
	);
};

const createMarketClosed = (data: InvestmentData): ReactNode => (
	<div>
		{createPrice(data, MarketStatus.CLOSED)}
		{MarketClosed}
	</div>
);

const getPriceAndBody = (
	status: MarketStatus,
	respectMarketStatus: boolean,
	loading: boolean,
	error: ErrorInfo | undefined,
	data: InvestmentData
): { Price: ReactNode; Body: ReactNode } =>
	match({
		status,
		respectMarketStatus,
		loading,
		error
	})
		.with({ status: MarketStatus.UNKNOWN }, () => ({
			Price: <div />,
			Body: <div />
		}))
		.with({ loading: true }, () => ({
			Price: <div />,
			Body: <Spinner />
		}))
		.with({ error: not(undefined) }, ({ error: errorInfo }) => ({
			Price: <div />,
			Body: createErrorMessage(errorInfo)
		}))
		.with(
			{ status: MarketStatus.CLOSED, respectMarketStatus: true },
			() => ({
				Price: createMarketClosed(data),
				Body: <div />
			})
		)
		.otherwise(() => ({
			Price: createPrice(data, MarketStatus.OPEN),
			Body: <ChartComp data={data} />
		}));

export const InvestmentCard = (props: Props) => {
	const { info, getActions = () => [] } = props;
	const { breakpoints } = useContext(ScreenContext);
	const breakpointName = getBreakpointName(breakpoints);
	const time = useSelector(timeValueSelector);
	const Time = createTime(time);
	const status = useSelector(marketStatusSelector);

	const { loading, data, error, respectMarketStatus } = useInvestmentData(
		time,
		info,
		status
	);

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
			className={`InvestmentCard ${breakpointName}`}
			role="listitem"
			data-testid={`market-card-${info.symbol}`}
			actions={!loading && !error ? getActions(info.symbol) : []}
		>
			{Body}
		</Card>
	);
};
