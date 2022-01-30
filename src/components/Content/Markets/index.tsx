import { useSelector } from 'react-redux';
import { timeValueSelector } from '../../../store/time/selectors';
import { useCallback, useEffect } from 'react';
import { Updater, useImmer } from 'use-immer';
import { HistoryDate } from '../../../types/history';
import { pipe } from 'fp-ts/es6/function';
import * as TaskEither from 'fp-ts/es6/TaskEither';
import * as tradierService from '../../../services/TradierService';

interface MarketData {
	readonly symbol: string;
	readonly name: string;
	readonly currentPrice: number;
	readonly history: ReadonlyArray<HistoryDate>;
}

interface State {
	readonly marketData: ReadonlyArray<MarketData>;
}

// TODO need error handling here
const useLoadMarketData = (setState: Updater<State>) =>
	useCallback(
		() =>
			pipe(
				tradierService.getQuotes(['VTI']),
				TaskEither.bindTo('quotes'),
				TaskEither.bind('history', () =>
					// TODO figure out a better solution for selecting the time range function
					TaskEither.sequenceArray([
						tradierService.getOneWeekHistory('VTI')
					])
				)
			)(),
		[setState]
	);

export const Markets = () => {
	const [state, setState] = useImmer<State>({
		marketData: []
	});
	const timeValue = useSelector(timeValueSelector);
	const loadMarketData = useLoadMarketData(setState);

	useEffect(() => {
		loadMarketData();
	}, [loadMarketData]);

	return <h1>Markets Page</h1>;
};
