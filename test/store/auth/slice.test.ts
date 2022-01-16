import { authSlice } from '../../../src/store/auth/slice';
import * as Option from 'fp-ts/es6/Option';
import { AuthUser } from '../../../src/types/auth';

const authUser: AuthUser = {
	userId: 1
};

describe('auth slice', () => {
	it('setUserData', () => {
		const result = authSlice.reducer(
			authSlice.getInitialState(),
			authSlice.actions.setUserData(Option.some(authUser))
		);
		expect(result).toEqual({
			hasChecked: true,
			userData: Option.some(authUser)
		});
	});
});
