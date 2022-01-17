import { ajaxApi } from '../../../src/services/AjaxApi';
import MockAdapter from 'axios-mock-adapter';
import thunk from 'redux-thunk';
import createMockStore from 'redux-mock-store';
import { loadAuthUser } from '../../../src/store/auth/actions';
import { RootState } from '../../../src/store';
import { AnyAction, ThunkDispatch } from '@reduxjs/toolkit';
import * as Option from 'fp-ts/es6/Option';
import { authSlice } from '../../../src/store/auth/slice';
import { AuthUser } from '../../../src/types/auth';

type DispatchExts = ThunkDispatch<RootState, void, AnyAction>;

const authUser: AuthUser = {
	userId: 1
};

const mockApi = new MockAdapter(ajaxApi.instance);
const mockStore = createMockStore<RootState, DispatchExts>([thunk])({
	auth: {
		hasChecked: false,
		userData: Option.none
	}
});

describe('auth actions', () => {
	beforeEach(() => {
		mockApi.reset();
		mockStore.clearActions();
	});

	describe('loadAuthUser', () => {
		it('user is authenticated', async () => {
			mockApi.onGet('/oauth/user').reply(200, authUser);
			await mockStore.dispatch(loadAuthUser());
			expect(mockStore.getActions()).toEqual([
				{
					type: authSlice.actions.setUserData.type,
					payload: Option.some(authUser)
				}
			]);
		});

		it('user is not authenticated', async () => {
			await mockStore.dispatch(loadAuthUser());
			expect(mockStore.getActions()).toEqual([
				{
					type: authSlice.actions.setUserData.type,
					payload: Option.none
				}
			]);
		});
	});
});
