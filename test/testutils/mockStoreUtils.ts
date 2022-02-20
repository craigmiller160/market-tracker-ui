import { RootState } from '../../src/store';
import * as Option from 'fp-ts/es6/Option';
import { MarketTime, marketTimeToMenuKey } from '../../src/types/MarketTime';
import { MarketStatus } from '../../src/types/MarketStatus';

export const defaultState: RootState = {
	auth: {
		hasChecked: false,
		userData: Option.none
	},
	marketSettings: {
		time: {
			menuKey: marketTimeToMenuKey(MarketTime.ONE_DAY),
			value: MarketTime.ONE_DAY
		},
		status: MarketStatus.UNKNOWN
	},
	notification: {
		notifications: []
	}
};
