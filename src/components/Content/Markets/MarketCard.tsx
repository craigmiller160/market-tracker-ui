import { Card, Space, Spin } from 'antd';
import { CaretDownFilled, CaretUpFilled } from '@ant-design/icons';
import { ReactNode, useCallback, useContext, useEffect } from 'react';
import { match } from 'ts-pattern';
import {
	getFiveYearDisplayStartDate,
	getOneMonthDisplayStartDate,
	getOneWeekDisplayStartDate,
	getOneYearDisplayStartDate,
	getThreeMonthDisplayStartDate,
	getTodayDisplayDate
} from '../../../utils/timeUtils';
import './MarketCard.scss';
import { ScreenContext } from '../../ScreenContext';
import { getBreakpointName } from '../../utils/Breakpoints';
import { MarketTime } from '../../../types/MarketTime';
import { MarketStatus } from '../../../types/MarketStatus';
import { MarketInvestmentInfo } from '../../../types/data/MarketInvestmentInfo';
import { useDispatch, useSelector } from 'react-redux';
import { timeValueSelector } from '../../../store/time/selectors';
import { MarketStatusContext } from '../MarketStatusContext';
import { PredicateT } from '@craigmiller160/ts-functions/es/types';
import { MarketInvestmentType } from '../../../types/data/MarketInvestmentType';
import {
	getInvestmentData,
	InvestmentData
} from '../../../services/MarketInvestmentService';
import { pipe } from 'fp-ts/es6/function';
import { Updater, useImmer } from 'use-immer';
import * as TaskEither from 'fp-ts/es6/TaskEither';
import { TaskT } from '@craigmiller160/ts-functions/es/types';
import { Dispatch } from 'redux';
import { notificationSlice } from '../../../store/notification/slice';
import { castDraft } from 'immer';
import { Chart as ChartComp } from '../../UI/Chart';

const Spinner = (
	<Space size="middle" className="Spinner">
		<Spin size="large" />
	</Space>
);

interface InvestmentDataState {
	readonly loading: boolean;
	readonly data: InvestmentData;
	readonly hasError: boolean;
}

interface Props {
	readonly info: MarketInvestmentInfo;
}

const createTitle = (info: MarketInvestmentInfo): ReactNode => (
	<h3>
		<strong>{`${info.name} (${info.symbol})`}</strong>
	</h3>
);

const localeOptions: Intl.NumberFormatOptions = {
	minimumFractionDigits: 2,
	maximumFractionDigits: 2
};

const createPrice = (data: InvestmentData) => {
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

const shouldRespectMarketStatus: PredicateT<MarketInvestmentInfo> = (info) =>
	info.type !== MarketInvestmentType.CRYPTO;

const createHandleGetDataError =
	(dispatch: Dispatch, setState: Updater<InvestmentDataState>) =>
	(ex: Error): TaskT<void> =>
	async () => {
		dispatch(
			notificationSlice.actions.addError(
				`Error getting data: ${ex.message}`
			)
		);
		setState((draft) => {
			draft.loading = false;
			draft.hasError = true;
			draft.data = {
				currentPrice: 0,
				history: []
			};
		});
	};

const createHandleGetDataSuccess =
	(setState: Updater<InvestmentDataState>) =>
	(data: InvestmentData): TaskT<void> =>
	async () => {
		setState((draft) => {
			draft.loading = false;
			draft.hasError = false;
			draft.data = castDraft(data);
		});
	};

// TODO move to separate file
const useInvestmentData = (
	time: MarketTime,
	info: MarketInvestmentInfo,
	shouldLoadData: boolean
): InvestmentDataState => {
	const dispatch = useDispatch();
	const [state, setState] = useImmer<InvestmentDataState>({
		loading: false,
		data: {
			currentPrice: 0,
			history: []
		},
		hasError: false
	});

	// TODO figure out a better way to handle this useCallback pattern
	const handleGetDataError = useCallback(
		(ex: Error) => createHandleGetDataError(dispatch, setState)(ex),
		[dispatch, setState]
	);
	const handleGetDataSuccess = useCallback(
		(data: InvestmentData) => createHandleGetDataSuccess(setState)(data),
		[setState]
	);

	useEffect(() => {
		if (!shouldLoadData) {
			return;
		}

		setState((draft) => {
			draft.loading = true;
		});

		pipe(
			getInvestmentData(time, info),
			TaskEither.fold(handleGetDataError, handleGetDataSuccess)
		)();
	}, [
		time,
		info,
		setState,
		handleGetDataError,
		handleGetDataSuccess,
		shouldLoadData
	]);

	return state;
};

export const MarketCard = ({ info }: Props) => {
	const Title = createTitle(info);
	const { breakpoints } = useContext(ScreenContext);
	const breakpointName = getBreakpointName(breakpoints);
	const time = useSelector(timeValueSelector);
	const Time = createTime(time);
	const { status } = useContext(MarketStatusContext);
	const respectMarketStatus = shouldRespectMarketStatus(info);
	const shouldLoadData =
		status === MarketStatus.OPEN ||
		(status === MarketStatus.CLOSED && !respectMarketStatus);
	const { loading, data, hasError } = useInvestmentData(
		time,
		info,
		shouldLoadData
	);

	// TODO improve error visuals
	const { Price, Body } = match({
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
			Body: <h3>Has Error</h3>
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
			className={`MarketCard ${breakpointName}`}
			role="listitem"
			data-testid={`market-card-${info.symbol}`}
		>
			{Body}
		</Card>
	);
};
