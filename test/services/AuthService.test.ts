import { ajaxApiFpTs } from '../../src/services/AjaxApi';
import MockAdapter from 'axios-mock-adapter';
import { getAuthUser } from '../../src/services/AuthService';
import { AuthUser } from '../../src/types/auth';
import '@relmify/jest-fp-ts';
import { mockLocation, restoreLocation } from '../testutils/mockLocation';
import { nanoid } from '@reduxjs/toolkit';

jest.mock('../../src/store', () => ({
	store: {
		dispatch: jest.fn()
	}
}));

const authUser: AuthUser = {
	userId: nanoid()
};

const mockApi = new MockAdapter(ajaxApiFpTs.instance);

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
});
