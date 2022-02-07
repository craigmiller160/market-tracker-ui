import { useDispatch, useSelector } from 'react-redux';
import { timeValueSelector } from '../../../store/time/selectors';
import { useEffect } from 'react';
import { MarketDataGroup } from '../../../types/MarketDataGroup';
import { useImmer } from 'use-immer';
import { MarketStatus } from '../../../types/MarketStatus';
import { pipe } from 'fp-ts/es6/function';
import { loadMarketData } from '../../../services/MarketDataService';
import * as TaskEither from 'fp-ts/es6/TaskEither';
import { notificationSlice } from '../../../store/notification/slice';
import { castDraft } from 'immer';

interface State {
	readonly loading: boolean;
	readonly usMarketData: MarketDataGroup;
	readonly intMarketData: MarketDataGroup;
}

const defaultMarketDataGroup: MarketDataGroup = {
	marketStatus: MarketStatus.OPEN,
	data: []
};

export const useMarketData = (): State => {
	const dispatch = useDispatch();
	const timeValue = useSelector(timeValueSelector);
	const [state, setState] = useImmer<State>({
		loading: true,
		usMarketData: defaultMarketDataGroup,
		intMarketData: defaultMarketDataGroup
	});

	useEffect(() => {
		pipe(
			loadMarketData(timeValue),
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
		)();
	}, [timeValue, dispatch, setState]);

	return state;
};
