import { match } from 'ts-pattern';
import * as TaskEither from 'fp-ts/es6/TaskEither';
import * as tradierService from '../../../services/TradierService';
import { TaskT, TaskTryT } from '@craigmiller160/ts-functions/es/types';
import { HistoryRecord } from '../../../types/history';
import { Updater, useImmer } from 'use-immer';
import { Dispatch } from 'redux';
import { alertSlice } from '../../../store/alert/slice';
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

interface State {
	readonly loading: boolean;
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

const useHistoryFn = (timeValue: string): HistoryFn => {
	const historyFn = match(timeValue)
		.with('oneDay', () => tradierService.getTimesales)
		.with('oneWeek', () => tradierService.getOneWeekHistory)
		.with('oneMonth', () => tradierService.getOneMonthHistory)
		.with('threeMonths', () => tradierService.getThreeMonthHistory)
		.with('oneYear', () => tradierService.getOneYearHistory)
		.with('fiveYears', () => tradierService.getFiveYearHistory)
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
			alertSlice.actions.showError(
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

const useLoadMarketData = (
	setState: Updater<State>,
	historyFn: HistoryFn,
	dispatch: Dispatch
) =>
	useCallback(
		(showLoading = false) => {
			setState((draft) => {
				draft.loading = showLoading;
			});
			const marketHistoryFns = MARKET_SYMBOLS.map((_) => historyFn(_));

			return pipe(
				TaskEither.sequenceArray(marketHistoryFns),
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
				)
			)();
		},
		[setState, historyFn, dispatch]
	);

const INTERVAL_5_MIN_MILLIS = 1000 * 60 * 5;

export const useMarketData = (): AllMarketData => {
	const dispatch = useDispatch();
	const [state, setState] = useImmer<State>({
		loading: true,
		usMarketData: [],
		internationalMarketData: []
	});

	const timeValue = useSelector(timeValueSelector);
	const historyFn = useHistoryFn(timeValue);
	const loadMarketData = useLoadMarketData(setState, historyFn, dispatch);

	useEffect(() => {
		loadMarketData(true);
		const interval = setInterval(loadMarketData, INTERVAL_5_MIN_MILLIS);
		return () => {
			clearInterval(interval);
		};
	}, [loadMarketData, timeValue]);

	return {
		...state,
		timeValue
	};
};
