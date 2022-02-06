import { RootState } from '../../src/store';
import * as Option from 'fp-ts/es6/Option';

export const defaultState: RootState = {
	auth: {
		hasChecked: false,
		userData: Option.none
	},
	time: {
		menuKey: 'time.oneDay',
		value: 'oneDay'
	},
	notification: {
		notifications: []
	}
};
