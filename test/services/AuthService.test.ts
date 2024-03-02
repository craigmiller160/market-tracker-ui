import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { marketTrackerApiFpTs } from '../../src/services/AjaxApi';
import MockAdapter from 'axios-mock-adapter';
import { getAuthUser } from '../../src/services/AuthService';
import { type AuthUser } from '../../src/types/auth';
import { mockLocation, restoreLocation } from '../testutils/mockLocation';
import { nanoid } from '@reduxjs/toolkit';

vi.mock('../../src/store', () => ({
	store: {
		dispatch: vi.fn()
	}
}));

const authUser: AuthUser = {
	userId: nanoid()
};

const mockApi = new MockAdapter(marketTrackerApiFpTs.instance);

describe('AuthService', () => {
	let location: Location;
	beforeEach(() => {
		mockApi.reset();
		vi.resetAllMocks();
		location = mockLocation();
	});

	afterEach(() => {
		restoreLocation(location);
	});

	it('getAuthUser', async () => {
		mockApi.onGet('/oauth/user').reply(200, authUser);

		const result = await getAuthUser();
		expect(result).toEqual(authUser);
	});
});
