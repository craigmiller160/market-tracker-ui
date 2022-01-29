import { isAuthorizedSelector } from '../../../src/store/auth/selectors';
import * as Option from 'fp-ts/es6/Option';
import produce from 'immer';
import { AuthUser } from '../../../src/types/auth';
import { defaultState } from '../../testutils/mockStoreUtils';

const authUser: AuthUser = {
	userId: 1
};

describe('selectors', () => {
	describe('isAuthorizedSelector', () => {
		it('is authorized', () => {
			const state = produce(defaultState, (draft) => {
				draft.auth.userData = Option.some(authUser);
			});
			const result = isAuthorizedSelector(state);
			expect(result).toEqual(true);
		});

		it('is not authorized', () => {
			const result = isAuthorizedSelector(defaultState);
			expect(result).toEqual(false);
		});
	});
});
