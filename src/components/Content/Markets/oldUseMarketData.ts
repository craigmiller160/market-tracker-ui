import { match } from 'ts-pattern';
import * as Task from 'fp-ts/es6/Task';
import * as TaskEither from 'fp-ts/es6/TaskEither';
import * as tradierService from '../../../services/TradierService';
import { TaskT, TaskTryT } from '@craigmiller160/ts-functions/es/types';
import { HistoryRecord } from '../../../types/history';
import { Updater, useImmer } from 'use-immer';
import { Dispatch } from 'redux';
import { Quote } from '../../../types/quote';
import { flow, pipe } from 'fp-ts/es6/function';
import * as RArray from 'fp-ts/es6/ReadonlyArray';
import { castDraft } from 'immer';
import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { timeValueSelector } from '../../../store/time/selectors';
import { MarketData } from '../../../types/MarketData';
import * as Option from 'fp-ts/es6/Option';
import { MARKET_INFO, MARKET_SYMBOLS } from './MarketInfo';
import { notificationSlice } from '../../../store/notification/slice';
import { MarketStatus } from '../../../types/MarketStatus';
import { MarketTime } from '../../../types/MarketTime';

// TODO delete this

interface State {
	readonly loading: boolean;
	readonly isMarketOpen: boolean;
	readonly usMarketData: ReadonlyArray<MarketData>;
	readonly internationalMarketData: ReadonlyArray<MarketData>;
}

export interface AllMarketData extends State {
	readonly timeValue: string;
}

interface DataLoadedResult {
	readonly quotes: ReadonlyArray<Quote>;
	readonly history: ReadonlyArray<ReadonlyArray<HistoryRecord>>;
}

type HistoryFn = (s: string) => TaskTryT<ReadonlyArray<HistoryRecord>>;

const useHistoryFn = (timeValue: MarketTime): HistoryFn => {
	const historyFn = match(timeValue)
		.with(MarketTime.ONE_DAY, () => tradierService.getTimesales)
		.with(MarketTime.ONE_WEEK, () => tradierService.getOneWeekHistory)
		.with(MarketTime.ONE_MONTH, () => tradierService.getOneMonthHistory)
		.with(
			MarketTime.THREE_MONTHS,
			() => tradierService.getThreeMonthHistory
		)
		.with(MarketTime.ONE_YEAR, () => tradierService.getOneYearHistory)
		.with(MarketTime.FIVE_YEARS, () => tradierService.getFiveYearHistory)
		.run();
	// eslint-disable-next-line react-hooks/exhaustive-deps
	return useCallback((s: string) => historyFn(s), [timeValue]);
};

const handleLoadMarketDataError =
	(setState: Updater<State>, dispatch: Dispatch) =>
	(ex: Error): TaskT<void> =>
	async () => {
		setState((draft) => {
			draft.loading = false;
			draft.usMarketData = [];
			draft.internationalMarketData = [];
		});
		console.error('Error loading market data', ex);
		dispatch(
			notificationSlice.actions.addError(
				`Error loading market data: ${ex.message}`
			)
		);
	};

const getCurrentPrice = (
	quotes: ReadonlyArray<Quote>,
	history: ReadonlyArray<HistoryRecord>,
	index: number
): number =>
	pipe(
		quotes,
		RArray.lookup(index),
		Option.map((_) => _.price),
		Option.getOrElse(() =>
			pipe(
				RArray.last(history),
				Option.map((_) => _.price),
				Option.getOrElse(() => 0)
			)
		)
	);

const handleLoadMarketDataSuccess =
	(setState: Updater<State>) =>
	({ quotes, history }: DataLoadedResult): TaskT<void> =>
	async () => {
		const { left: usa, right: international } = pipe(
			MARKET_SYMBOLS,
			RArray.mapWithIndex(
				(index, symbol): MarketData => ({
					symbol,
					name: MARKET_INFO[index].name,
					currentPrice: getCurrentPrice(
						quotes,
						history[index],
						index
					),
					isInternational: MARKET_INFO[index].isInternational,
					history: history[index]
				})
			),
			RArray.partition((data): boolean => data.isInternational)
		);
		setState((draft) => {
			draft.loading = false;
			draft.isMarketOpen = true;
			draft.usMarketData = castDraft(usa);
			draft.internationalMarketData = castDraft(international);
		});
	};

const shouldGetQuote: (arg: {
	history: ReadonlyArray<ReadonlyArray<HistoryRecord>>;
}) => boolean = flow(
	({ history }) => history,
	RArray.head,
	Option.chain(RArray.last),
	Option.filter((item) => item.unixTimestampMillis <= new Date().getTime()),
	Option.fold(
		() => false,
		() => true
	)
);

const createDoLoadMarketData =
	(setState: Updater<State>, historyFn: HistoryFn, dispatch: Dispatch) =>
	(): TaskT<MarketStatus> =>
		pipe(
			TaskEither.sequenceArray(MARKET_SYMBOLS.map((_) => historyFn(_))),
			TaskEither.bindTo('history'),
			TaskEither.bind('shouldGetQuote', (_) =>
				TaskEither.of(shouldGetQuote(_))
			),
			TaskEither.bind('quotes', (_) =>
				match(_)
					.with({ shouldGetQuote: true }, () =>
						tradierService.getQuotes(MARKET_SYMBOLS)
					)
					.otherwise(() => TaskEither.of([]))
			),
			TaskEither.fold(
				handleLoadMarketDataError(setState, dispatch),
				handleLoadMarketDataSuccess(setState)
			),
			Task.map(() => MarketStatus.OPEN)
		);

const createLoadMarketDataIfOpen =
	(setState: Updater<State>, dispatch: Dispatch, historyFn: HistoryFn) =>
	(status: MarketStatus): TaskT<MarketStatus> => {
		const doLoadMarketData = createDoLoadMarketData(
			setState,
			historyFn,
			dispatch
		);
		return match(status)
			.with(MarketStatus.OPEN, () => doLoadMarketData())
			.otherwise(() => async () => MarketStatus.CLOSED);
	};

const useLoadMarketData = (
	setState: Updater<State>,
	historyFn: HistoryFn,
	dispatch: Dispatch
) => {
	const loadMarketDataIfOpen = createLoadMarketDataIfOpen(
		setState,
		dispatch,
		historyFn
	);
	const doLoadMarketData = createDoLoadMarketData(
		setState,
		historyFn,
		dispatch
	);
	return useCallback(
		(timeValue: string, showLoading = false): TaskT<MarketStatus> => {
			setState((draft) => {
				draft.loading = showLoading;
			});

			return match(timeValue)
				.with(MarketTime.ONE_DAY, () =>
					pipe(
						tradierService.isMarketClosed(),
						TaskEither.fold(
							() => async () => MarketStatus.CLOSED,
							(_) => async () => _
						),
						Task.chain(loadMarketDataIfOpen)
					)
				)
				.otherwise(() => doLoadMarketData());
		},
		[setState, historyFn, dispatch] // eslint-disable-line react-hooks/exhaustive-deps
	);
};

const INTERVAL_5_MIN_MILLIS = 1000 * 60 * 5;

const getEmptyUsMarketData = () =>
	MARKET_INFO.filter((_) => !_.isInternational).map(
		(_): MarketData => ({
			symbol: _.symbol,
			name: _.name,
			currentPrice: 0,
			isInternational: _.isInternational,
			history: []
		})
	);
const getEmptyIntMarketData = () =>
	MARKET_INFO.filter((_) => _.isInternational).map(
		(_): MarketData => ({
			symbol: _.symbol,
			name: _.name,
			currentPrice: 0,
			isInternational: _.isInternational,
			history: []
		})
	);

export const useMarketData = (): AllMarketData => {
	const dispatch = useDispatch();
	const [state, setState] = useImmer<State>({
		loading: true,
		isMarketOpen: true,
		usMarketData: [],
		internationalMarketData: []
	});

	const timeValue = useSelector(timeValueSelector);
	const historyFn = useHistoryFn(timeValue);
	const loadMarketData = useLoadMarketData(setState, historyFn, dispatch);

	useEffect(() => {
		const interval = pipe(
			loadMarketData(timeValue, true),
			Task.map((status) =>
				match(status)
					.with(MarketStatus.CLOSED, () => {
						setState((draft) => {
							draft.usMarketData = castDraft(
								getEmptyUsMarketData()
							);
							draft.internationalMarketData = castDraft(
								getEmptyIntMarketData()
							);
							draft.loading = false;
							draft.isMarketOpen = false;
						});
						return 1;
					})
					.otherwise(() =>
						setInterval(loadMarketData, INTERVAL_5_MIN_MILLIS)
					)
			)
		)();
		return () => {
			interval.then((_) => clearInterval(_));
		};
	}, [loadMarketData, timeValue, setState]);

	return {
		...state,
		timeValue
	};
};
