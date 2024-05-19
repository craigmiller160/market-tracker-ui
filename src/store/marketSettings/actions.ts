import { type StoreDispatch } from '../index';
import { timeValueSelector } from './selectors';
import { menuKeyToMarketTime } from '../../types/MarketTime';
import { marketSettingsSlice } from './slice';
import type { RootState } from '../createStore';

export const changeSelectedTime =
	(timeMenuKey: string) =>
	(dispatch: StoreDispatch, getState: () => RootState) => {
		const state = getState();
		const currentTimeValue = timeValueSelector(state);
		const newTimeValue = menuKeyToMarketTime(timeMenuKey);

		if (currentTimeValue === newTimeValue) {
			return Promise.resolve();
		}

		dispatch(marketSettingsSlice.actions.setTime(timeMenuKey));
	};
