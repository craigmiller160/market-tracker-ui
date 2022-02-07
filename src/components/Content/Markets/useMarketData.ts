import { useDispatch, useSelector } from 'react-redux';
import { timeValueSelector } from '../../../store/time/selectors';
import { useCallback, useEffect } from 'react';
import { MarketDataGroup } from '../../../types/MarketDataGroup';
import { Updater, useImmer } from 'use-immer';
import { MarketStatus } from '../../../types/MarketStatus';
import { pipe } from 'fp-ts/es6/function';
import { loadMarketData } from '../../../services/MarketDataService';
import * as TaskEither from 'fp-ts/es6/TaskEither';
import { notificationSlice } from '../../../store/notification/slice';
import { castDraft } from 'immer';
import { MarketTime } from '../../../types/MarketTime';
import { Dispatch } from 'redux';
import { TaskT } from '@craigmiller160/ts-functions/es/types';

// TODO add repeat

interface State {
	readonly loading: boolean;
	readonly usMarketData: MarketDataGroup;
	readonly intMarketData: MarketDataGroup;
}

const defaultMarketDataGroup: MarketDataGroup = {
	time: MarketTime.ONE_DAY,
	marketStatus: MarketStatus.OPEN,
	data: []
};

const createMarketDataLoader =
	(setState: Updater<State>, dispatch: Dispatch) =>
	(time: MarketTime): TaskT<void> =>
		pipe(
			loadMarketData(time),
			TaskEither.fold(
				(ex) => async () => {
					console.error(ex);
					dispatch(
						notificationSlice.actions.addError(
							`Error loading market data: ${ex.message}`
						)
					);
					setState((draft) => {
						draft.loading = false;
					});
				},
				([us, int]) =>
					async () => {
						setState((draft) => {
							draft.loading = false;
							draft.usMarketData = castDraft(us);
							draft.intMarketData = castDraft(int);
						});
					}
			)
		);

export const useMarketData = (): State => {
	const dispatch = useDispatch();
	const timeValue = useSelector(timeValueSelector);
	const [state, setState] = useImmer<State>({
		loading: true,
		usMarketData: defaultMarketDataGroup,
		intMarketData: defaultMarketDataGroup
	});
	// eslint-disable-next-line react-hooks/exhaustive-deps
	const marketDataLoader = useCallback(
		createMarketDataLoader(setState, dispatch),
		[]
	);

	useEffect(() => {
		// TODO set loading when timeValue changes
		marketDataLoader(timeValue)();
	}, [timeValue, marketDataLoader]);

	return state;
};
