import { ajaxApi } from '../../src/services/AjaxApi';
import MockAdapter from 'axios-mock-adapter';
import { getAuthUser, logout } from '../../src/services/AuthService';
import { AuthUser } from '../../src/types/auth';
import '@relmify/jest-fp-ts';

const authUser: AuthUser = {
	userId: 1
};

const mockApi = new MockAdapter(ajaxApi.instance);

describe('AuthService', () => {
	beforeEach(() => {
		mockApi.reset();
	});

	it('getAuthUser', async () => {
		mockApi.onGet('/oauth/user').reply(200, authUser);

		const result = await getAuthUser()();
		expect(result).toEqualRight(authUser);
	});

	it('login', () => {
		throw new Error();
	});

	it('logout', async () => {
		mockApi.onGet('/oauth/logout').reply(200);

		const result = await logout()();
		expect(result).toBeRight();
	});
});
