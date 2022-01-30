import { useDispatch, useSelector } from 'react-redux';
import { timeValueSelector } from '../../../store/time/selectors';
import { useCallback, useEffect } from 'react';
import { Updater, useImmer } from 'use-immer';
import { HistoryDate } from '../../../types/history';
import { pipe } from 'fp-ts/es6/function';
import * as TaskEither from 'fp-ts/es6/TaskEither';
import * as tradierService from '../../../services/TradierService';
import { TaskTryT } from '@craigmiller160/ts-functions/es/types';
import { match } from 'ts-pattern';
import { alertSlice } from '../../../store/alert/slice';
import * as RArray from 'fp-ts/es6/ReadonlyArray';
import { Draft } from 'immer';

interface MarketData {
	readonly symbol: string;
	readonly name: string;
	readonly currentPrice: number;
	readonly history: ReadonlyArray<HistoryDate>;
}

interface State {
	readonly marketData: ReadonlyArray<MarketData>;
}

type HistoryFn = (s: string) => TaskTryT<ReadonlyArray<HistoryDate>>;

const MARKET_SYMBOLS = ['VTI'];

// TODO need error handling here
const useLoadMarketData = (setState: Updater<State>, historyFn: HistoryFn) => {
	const dispatch = useDispatch();
	return useCallback(() => {
		const marketHistoryFns = MARKET_SYMBOLS.map((_) => historyFn(_));
		return pipe(
			tradierService.getQuotes(MARKET_SYMBOLS),
			TaskEither.bindTo('quotes'),
			TaskEither.bind('history', () =>
				TaskEither.sequenceArray(marketHistoryFns)
			),
			TaskEither.fold(
				(ex) => async () => {
					console.error('Error loading market data', ex);
					dispatch(
						alertSlice.actions.showError(
							`Error loading market data: ${ex.message}`
						)
					);
				},
				({ quotes, history }) =>
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
						setState((draft: Draft<State>) => {
							draft.marketData = marketData;
						});
					}
			)
		)();
	}, [setState, historyFn, dispatch]);
};

const getHistoryFn = (timeValue: string): HistoryFn =>
	match(timeValue)
		.with('oneDay', () => () => TaskEither.right([]))
		.with('oneWeek', () => tradierService.getOneWeekHistory)
		.with('oneMonth', () => tradierService.getOneMonthHistory)
		.with('threeMonths', () => tradierService.getThreeMonthHistory)
		.with('oneYear', () => tradierService.getOneYearHistory)
		.with('fiveYears', () => tradierService.getFiveYearHistory)
		.run();

export const Markets = () => {
	const [state, setState] = useImmer<State>({
		marketData: []
	});
	const timeValue = useSelector(timeValueSelector);
	const historyFn = getHistoryFn(timeValue);
	const loadMarketData = useLoadMarketData(setState, historyFn);

	useEffect(() => {
		loadMarketData();
	}, [loadMarketData]);

	return <h1>Markets Page</h1>;
};
