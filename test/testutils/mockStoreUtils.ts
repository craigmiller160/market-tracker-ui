import { RootState } from '../../src/store';
import * as Option from 'fp-ts/Option';
import { MarketTime, marketTimeToMenuKey } from '../../src/types/MarketTime';

export const defaultState: RootState = {
	auth: {
		hasChecked: false,
		userData: Option.none
	},
	marketSettings: {
		time: {
			menuKey: marketTimeToMenuKey(MarketTime.ONE_DAY),
			value: MarketTime.ONE_DAY
		}
	},
	notification: {
		notifications: []
	}
};
