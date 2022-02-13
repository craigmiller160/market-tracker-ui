import { useDispatch, useSelector } from 'react-redux';
import { timeValueSelector } from '../../../store/time/selectors';
import { useCallback, useEffect } from 'react';
import { MarketDataGroup } from '../../../types/MarketDataGroup';
import { Updater, useImmer } from 'use-immer';
import { MarketStatus } from '../../../types/MarketStatus';
import { pipe } from 'fp-ts/es6/function';
import {
	GlobalMarketData,
	loadMarketData
} from '../../../services/MarketDataService';
import * as TaskEither from 'fp-ts/es6/TaskEither';
import { notificationSlice } from '../../../store/notification/slice';
import { castDraft } from 'immer';
import { MarketTime } from '../../../types/MarketTime';
import { Dispatch } from 'redux';
import { TaskT } from '@craigmiller160/ts-functions/es/types';
import { InvestmentType } from '../../../data/InvestmentInfo';

const INTERVAL_1_MIN_MILLIS = 1000 * 60;

interface State {
	readonly loading: boolean;
	readonly time: MarketTime;
	readonly usMarketData: MarketDataGroup;
	readonly intMarketData: MarketDataGroup;
	readonly cryptoMarketData: MarketDataGroup;
}

const createDefaultMarketDataGroup = (
	type: InvestmentType
): MarketDataGroup => ({
	time: MarketTime.ONE_DAY,
	marketStatus: MarketStatus.OPEN,
	data: [],
	type
});

const handleLoadError =
	(setState: Updater<State>, dispatch: Dispatch) =>
	(ex: Error) =>
	async () => {
		console.error(ex);
		dispatch(
			notificationSlice.actions.addError(
				`Error loading market data: ${ex.message}`
			)
		);
		setState((draft) => {
			draft.loading = false;
		});
	};

const handleLoadSuccess =
	(setState: Updater<State>) =>
	([us, int, crypto]: GlobalMarketData) =>
	async () => {
		setState((draft) => {
			if (draft.time === us.time) {
				draft.loading = false;
				draft.usMarketData = castDraft(us);
				draft.intMarketData = castDraft(int);
				draft.cryptoMarketData = castDraft(crypto);
			}
		});
	};

const createMarketDataLoader =
	(setState: Updater<State>, dispatch: Dispatch) =>
	(time: MarketTime): TaskT<void> =>
		pipe(
			loadMarketData(time),
			TaskEither.fold(
				handleLoadError(setState, dispatch),
				handleLoadSuccess(setState)
			)
		);

export const useMarketData = (): State => {
	const dispatch = useDispatch();
	const timeValue = useSelector(timeValueSelector);
	const [state, setState] = useImmer<State>({
		loading: true,
		time: MarketTime.ONE_DAY,
		usMarketData: createDefaultMarketDataGroup(InvestmentType.USA_ETF),
		intMarketData: createDefaultMarketDataGroup(
			InvestmentType.INTERNATIONAL_ETF
		),
		cryptoMarketData: createDefaultMarketDataGroup(InvestmentType.CRYPTO)
	});
	// eslint-disable-next-line react-hooks/exhaustive-deps
	const marketDataLoader = useCallback(
		createMarketDataLoader(setState, dispatch),
		[]
	);

	useEffect(() => {
		setState((draft) => {
			draft.time = timeValue;
			draft.loading = true;
		});
		marketDataLoader(timeValue)();
	}, [timeValue, marketDataLoader, setState]);

	useEffect(() => {
		let interval: NodeJS.Timer | undefined = undefined;
		if (!state.loading && MarketTime.ONE_DAY === timeValue) {
			interval = setInterval(
				() => marketDataLoader(timeValue)(),
				INTERVAL_1_MIN_MILLIS
			);
		}
		return () => {
			if (!interval) {
				clearInterval(interval);
			}
		};
	}, [state.loading, timeValue, marketDataLoader]);

	return state;
};
