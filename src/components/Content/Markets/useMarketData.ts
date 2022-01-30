import { match } from 'ts-pattern';
import * as TaskEither from 'fp-ts/es6/TaskEither';
import * as tradierService from '../../../services/TradierService';
import { TaskT, TaskTryT } from '@craigmiller160/ts-functions/es/types';
import { HistoryDate } from '../../../types/history';
import { Updater, useImmer } from 'use-immer';
import { Dispatch } from 'redux';
import { alertSlice } from '../../../store/alert/slice';
import { Quote } from '../../../types/quote';
import { pipe } from 'fp-ts/es6/function';
import * as RArray from 'fp-ts/es6/ReadonlyArray';
import { castDraft } from 'immer';
import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { timeValueSelector } from '../../../store/time/selectors';

const MARKET_SYMBOLS = ['VTI'];

interface MarketData {
	readonly symbol: string;
	readonly name: string;
	readonly currentPrice: number;
	readonly history: ReadonlyArray<HistoryDate>;
}

interface State {
	readonly marketData: ReadonlyArray<MarketData>;
}

interface DataLoadedResult {
	readonly quotes: ReadonlyArray<Quote>;
	readonly history: ReadonlyArray<ReadonlyArray<HistoryDate>>;
}

type HistoryFn = (s: string) => TaskTryT<ReadonlyArray<HistoryDate>>;

const useHistoryFn = (timeValue: string): HistoryFn => {
	const historyFn = match(timeValue)
		.with('oneDay', () => () => TaskEither.right([]))
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
	(dispatch: Dispatch) =>
	(ex: Error): TaskT<void> =>
	async () => {
		console.error('Error loading market data', ex);
		dispatch(
			alertSlice.actions.showError(
				`Error loading market data: ${ex.message}`
			)
		);
	};

const handleLoadMarketDataSuccess =
	(setState: Updater<State>) =>
	({ quotes, history }: DataLoadedResult): TaskT<void> =>
	async () => {
		const marketData = pipe(
			quotes,
			RArray.mapWithIndex(
				(index, quote): MarketData => ({
					symbol: quote.symbol,
					name: '', // TODO figure this one out
					currentPrice: quote.price,
					history: history[index]
				})
			)
		);
		setState((draft) => {
			draft.marketData = castDraft(marketData);
		});
	};

const useLoadMarketData = (
	setState: Updater<State>,
	historyFn: HistoryFn,
	dispatch: Dispatch
) =>
	useCallback(() => {
		const marketHistoryFns = MARKET_SYMBOLS.map((_) => historyFn(_));
		return pipe(
			tradierService.getQuotes(MARKET_SYMBOLS),
			TaskEither.bindTo('quotes'),
			TaskEither.bind('history', () =>
				TaskEither.sequenceArray(marketHistoryFns)
			),
			TaskEither.fold(
				handleLoadMarketDataError(dispatch),
				handleLoadMarketDataSuccess(setState)
			)
		)();
	}, [setState, historyFn, dispatch]);

export const useMarketData = () => {
	const dispatch = useDispatch();
	const [state, setState] = useImmer<State>({
		marketData: []
	});

	const timeValue = useSelector(timeValueSelector);
	const historyFn = useHistoryFn(timeValue);
	const loadMarketData = useLoadMarketData(setState, historyFn, dispatch);

	useEffect(() => {
		loadMarketData();
	}, [loadMarketData, timeValue]);

	return state.marketData;
};
