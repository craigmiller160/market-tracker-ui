import { AppThunkAction } from '../index';
import { timeValueSelector } from './selectors';
import { MarketTime, menuKeyToMarketTime } from '../../types/MarketTime';
import { marketSettingsSlice } from './slice';
import { checkMarketStatus } from '../../services/MarketInvestmentService';
import { pipe } from 'fp-ts/es6/function';
import * as Task from 'fp-ts/es6/Task';

export const changeSelectedTime =
	(timeMenuKey: string): AppThunkAction<Promise<unknown>> =>
	(dispatch, getState) => {
		const state = getState();
		const currentTimeValue = timeValueSelector(state);
		const newTimeValue = menuKeyToMarketTime(timeMenuKey);

		if (currentTimeValue === newTimeValue) {
			return Promise.resolve();
		}

		dispatch(marketSettingsSlice.actions.setTime(timeMenuKey));

		return dispatch(checkAndUpdateMarketStatus(newTimeValue));
	};

export const checkAndUpdateMarketStatus =
	(timeValue: MarketTime): AppThunkAction<Promise<unknown>> =>
	(dispatch) =>
		pipe(
			checkMarketStatus(timeValue),
			Task.map((status) =>
				dispatch(marketSettingsSlice.actions.setStatus(status))
			)
		)();
