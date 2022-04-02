import { Card, Space, Spin, Typography } from 'antd';
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
import { useInvestmentData } from '../../../hooks/useInvestmentData';
import { InvestmentInfo } from '../../../../types/data/InvestmentInfo';
import { InvestmentType } from '../../../../types/data/InvestmentType';

const Spinner = (
	<Space size="middle" className="Spinner">
		<Spin size="large" />
	</Space>
);

interface Props {
	readonly info: InvestmentInfo;
}

const createTitle = (info: InvestmentInfo): ReactNode => (
	<h3>
		<strong>{`${info.name} (${info.symbol})`}</strong>
	</h3>
);

const localeOptions: Intl.NumberFormatOptions = {
	minimumFractionDigits: 2,
	maximumFractionDigits: 2
};

const createPrice = (data: InvestmentData) => {
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
	const priceClassName = priceChange >= 0 ? 'up' : 'down';
	const ChangeIcon =
		priceChange >= 0 ? <CaretUpFilled /> : <CaretDownFilled />;

	return (
		<p className={priceClassName}>
			<span className="Price">
				<span>
					<span className="Icon">{ChangeIcon}</span>
					{formattedPrice}{' '}
				</span>
				<span>
					({formattedPriceChange}, {formattedPercentChange})
				</span>
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

const ErrorMsg = (
	<Typography.Title className="ErrorMsg" level={3}>
		Error: Unable to Get Data
	</Typography.Title>
);

const getPriceAndBody = (
	status: MarketStatus,
	respectMarketStatus: boolean,
	loading: boolean,
	hasError: boolean,
	data: InvestmentData
): { Price: ReactNode; Body: ReactNode } =>
	match({
		status,
		respectMarketStatus,
		loading,
		hasError
	})
		.with({ status: MarketStatus.UNKNOWN }, () => ({
			Price: <div />,
			Body: <div />
		}))
		.with({ loading: true }, () => ({
			Price: <div />,
			Body: Spinner
		}))
		.with({ hasError: true }, () => ({
			Price: <div />,
			Body: ErrorMsg
		}))
		.with(
			{ status: MarketStatus.CLOSED, respectMarketStatus: true },
			() => ({
				Price: MarketClosed,
				Body: <div />
			})
		)
		.otherwise(() => ({
			Price: createPrice(data),
			Body: <ChartComp data={data} />
		}));

const shouldRespectMarketStatus = (info: InvestmentInfo) =>
	info.type !== InvestmentType.CRYPTO;

export const InvestmentCard = ({ info }: Props) => {
	const Title = createTitle(info);
	const { breakpoints } = useContext(ScreenContext);
	const breakpointName = getBreakpointName(breakpoints);
	const time = useSelector(timeValueSelector);
	const Time = createTime(time);
	const status = useSelector(marketStatusSelector);
	const respectMarketStatus = shouldRespectMarketStatus(info);
	const shouldLoadData =
		status === MarketStatus.OPEN ||
		(status === MarketStatus.CLOSED && !respectMarketStatus);
	const { loading, data, hasError } = useInvestmentData(
		time,
		info,
		shouldLoadData
	);

	const { Price, Body } = getPriceAndBody(
		status,
		respectMarketStatus,
		loading,
		hasError,
		data
	);

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
		>
			{Body}
		</Card>
	);
};
