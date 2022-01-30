import { useSelector } from 'react-redux';
import { timeValueSelector } from '../../../store/time/selectors';
import { useEffect } from 'react';
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

const createLoadMarketData = (setState: Updater<State>) =>
	pipe(
		TaskEither.sequenceArray([
			tradierService.getQuotes(['VTI']),
			tradierService.getOneWeekHistory('VTI')
		])
	);

export const Markets = () => {
	const [state, setState] = useImmer<State>({
		marketData: []
	});
	const timeValue = useSelector(timeValueSelector);
	const loadMarketData = createLoadMarketData(setState);
	useEffect(() => {
		loadMarketData();
	}, [loadMarketData]);

	return <h1>Markets Page</h1>;
};
