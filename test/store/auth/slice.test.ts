import { authSlice } from '../../../src/store/auth/slice';
import * as Option from 'fp-ts/es6/Option';
import { AuthUser } from '../../../src/types/auth';
import { nanoid } from '@reduxjs/toolkit';

const authUser: AuthUser = {
	userId: nanoid()
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

	it('reset', () => {
		const result = authSlice.reducer(
			{
				userData: Option.some(authUser),
				hasChecked: true
			},
			authSlice.actions.reset()
		);
		expect(result).toEqual(authSlice.getInitialState());
	});
});
