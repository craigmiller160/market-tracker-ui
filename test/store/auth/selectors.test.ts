import { isAuthorizedSelector } from '../../../src/store/auth/selectors';
import { RootState } from '../../../src/store';
import * as Option from 'fp-ts/es6/Option';
import produce from 'immer';
import { AuthUser } from '../../../src/types/auth';

const authUser: AuthUser = {
	userId: 1
};

const baseState: RootState = {
	auth: {
		hasChecked: false,
		userData: Option.none
	},
	alert: {
		show: false,
		message: '',
		type: 'success'
	}
};

describe('selectors', () => {
	describe('isAuthorizedSelector', () => {
		it('is authorized', () => {
			const state = produce(baseState, (draft) => {
				draft.auth.userData = Option.some(authUser);
			});
			const result = isAuthorizedSelector(state);
			expect(result).toEqual(true);
		});

		it('is not authorized', () => {
			const result = isAuthorizedSelector(baseState);
			expect(result).toEqual(false);
		});
	});
});
