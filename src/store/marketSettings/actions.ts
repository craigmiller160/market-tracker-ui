import { Dispatch } from 'redux';
import { RootState } from '../index';
import { timeValueSelector } from './selectors';
import { menuKeyToMarketTime } from '../../types/MarketTime';
import { marketSettingsSlice } from './slice';
import { checkMarketStatus } from '../../services/MarketInvestmentService';
import { pipe } from 'fp-ts/es6/function';
import * as Task from 'fp-ts/es6/Task';

export const changeSelectedTime =
	(timeMenuKey: string) =>
	(dispatch: Dispatch, getState: () => RootState): Promise<unknown> => {
		const state = getState();
		const currentTimeValue = timeValueSelector(state);
		const newTimeValue = menuKeyToMarketTime(timeMenuKey);

		if (currentTimeValue === newTimeValue) {
			return Promise.resolve();
		}

		dispatch(marketSettingsSlice.actions.setTime(timeMenuKey));

		return pipe(
			checkMarketStatus(newTimeValue),
			Task.map((status) =>
				dispatch(marketSettingsSlice.actions.setStatus(status))
			)
		)();
	};
