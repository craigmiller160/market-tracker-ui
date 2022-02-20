import { Dispatch } from 'redux';
import { RootState } from '../index';
import { timeValueSelector } from './selectors';
import { menuKeyToMarketTime } from '../../types/MarketTime';

export const changeSelectedTime =
	(timeMenuKey: string) =>
	(dispatch: Dispatch, getState: () => RootState) => {
		const state = getState();
		const currentTimeValue = timeValueSelector(state);
		const newTimeValue = menuKeyToMarketTime(timeMenuKey);

		if (currentTimeValue === newTimeValue) {
			return;
		}
	};
