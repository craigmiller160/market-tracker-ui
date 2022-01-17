import { ajaxApi } from '../../src/services/AjaxApi';
import MockAdapter from 'axios-mock-adapter';
import { getAuthUser, login, logout } from '../../src/services/AuthService';
import { AuthCodeLogin, AuthUser } from '../../src/types/auth';
import '@relmify/jest-fp-ts';
import { mockLocation, restoreLocation } from '../testutils/mockLocation';
import { store } from '../../src/store';
import { authSlice } from '../../src/store/auth/slice';
import * as Option from 'fp-ts/es6/Option';

jest.mock('../../src/store', () => ({
	store: {
		dispatch: jest.fn()
	}
}));

const authUser: AuthUser = {
	userId: 1
};

const authCodeLogin: AuthCodeLogin = {
	url: 'http://auth.com'
};

const mockApi = new MockAdapter(ajaxApi.instance);
const mockDispatch = store.dispatch as jest.Mock;

describe('AuthService', () => {
	let location: Location;
	beforeEach(() => {
		mockApi.reset();
		jest.resetAllMocks();
		location = mockLocation();
	});

	afterEach(() => {
		restoreLocation(location);
	});

	it('getAuthUser', async () => {
		mockApi.onGet('/oauth/user').reply(200, authUser);

		const result = await getAuthUser()();
		expect(result).toEqualRight(authUser);
	});

	it('login', async () => {
		mockApi.onPost('/oauth/authcode/login').reply(200, authCodeLogin);

		const result = await login()();
		expect(result).toEqualRight(authCodeLogin);
		expect(window.location.assign).toHaveBeenCalledWith(authCodeLogin.url);
	});

	it('logout', async () => {
		mockApi.onGet('/oauth/logout').reply(200);

		const result = await logout(mockDispatch)();
		expect(result).toBeRight();
		expect(mockDispatch).toHaveBeenCalledWith({
			type: authSlice.actions.setUserData.type,
			payload: Option.none
		});
	});
});
