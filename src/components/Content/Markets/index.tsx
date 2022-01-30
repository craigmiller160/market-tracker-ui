import { useSelector } from 'react-redux';
import { timeValueSelector } from '../../../store/time/selectors';
import { useCallback, useEffect } from 'react';
import { Updater, useImmer } from 'use-immer';
import { HistoryDate } from '../../../types/history';
import { pipe } from 'fp-ts/es6/function';
import * as TaskEither from 'fp-ts/es6/TaskEither';
import * as tradierService from '../../../services/TradierService';
import { TaskTryT } from '@craigmiller160/ts-functions/types';
import { match } from 'ts-pattern';

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

// TODO need error handling here
const useLoadMarketData = (setState: Updater<State>, historyFn: HistoryFn) =>
	useCallback(
		() =>
			pipe(
				tradierService.getQuotes(['VTI']),
				TaskEither.bindTo('quotes'),
				TaskEither.bind('history', () =>
					TaskEither.sequenceArray([historyFn('VTI')])
				)
			)(),
		[setState, historyFn]
	);

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
