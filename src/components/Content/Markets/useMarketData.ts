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
import { MarketData } from './MarketData';

interface MarketInfo {
	readonly symbol: string;
	readonly name: string;
	readonly isInternational: boolean;
}

const MARKET_INFO: ReadonlyArray<MarketInfo> = [
	{
		symbol: 'VTI',
		name: 'US Total Market',
		isInternational: false
	}
];
const MARKET_SYMBOLS = MARKET_INFO.map((_) => _.symbol);

interface AllMarketData {
	readonly loading: boolean;
	readonly usMarketData: ReadonlyArray<MarketData>;
	readonly internationalMarketData: ReadonlyArray<MarketData>;
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
	(setState: Updater<AllMarketData>, dispatch: Dispatch) =>
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

const handleLoadMarketDataSuccess =
	(setState: Updater<AllMarketData>) =>
	({ quotes, history }: DataLoadedResult): TaskT<void> =>
	async () => {
		const { init, rest } = pipe(
			quotes,
			RArray.mapWithIndex(
				(index, quote): MarketData => ({
					symbol: quote.symbol,
					name: MARKET_INFO[index].name,
					currentPrice: quote.price,
					isInternational: MARKET_INFO[index].isInternational,
					history: history[index]
				})
			),
			RArray.spanLeft((data) => data.isInternational)
		);
		setState((draft) => {
			draft.loading = false;
			draft.usMarketData = castDraft(rest);
			draft.internationalMarketData = castDraft(init);
		});
	};

const useLoadMarketData = (
	setState: Updater<AllMarketData>,
	historyFn: HistoryFn,
	dispatch: Dispatch
) =>
	useCallback(() => {
		setState((draft) => {
			draft.loading = true;
		});
		const marketHistoryFns = MARKET_SYMBOLS.map((_) => historyFn(_));
		return pipe(
			tradierService.getQuotes(MARKET_SYMBOLS),
			TaskEither.bindTo('quotes'),
			TaskEither.bind('history', () =>
				TaskEither.sequenceArray(marketHistoryFns)
			),
			TaskEither.fold(
				handleLoadMarketDataError(setState, dispatch),
				handleLoadMarketDataSuccess(setState)
			)
		)();
	}, [setState, historyFn, dispatch]);

export const useMarketData = (): AllMarketData => {
	const dispatch = useDispatch();
	const [state, setState] = useImmer<AllMarketData>({
		loading: true,
		usMarketData: [],
		internationalMarketData: []
	});

	const timeValue = useSelector(timeValueSelector);
	const historyFn = useHistoryFn(timeValue);
	const loadMarketData = useLoadMarketData(setState, historyFn, dispatch);

	useEffect(() => {
		loadMarketData();
	}, [loadMarketData, timeValue]);

	return state;
};
