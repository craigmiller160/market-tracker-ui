import { newTestServer } from './testutils/server';
import { ajaxApi, getResponseData } from '../src/services/AjaxApi';
import { pipe } from 'fp-ts/es6/function';
import * as TaskEither from 'fp-ts/es6/TaskEither';
import '@relmify/jest-fp-ts';
import { Server } from 'miragejs/server';

// TODO delete this in the end

describe('mirage server', () => {
	let server: Server;
	beforeAll(() => {
		server = newTestServer();
	});

	afterAll(() => {
		server.shutdown();
	});

	it('gets data with request', async () => {
		const result = await pipe(
			ajaxApi.get<ReadonlyArray<string>>({
				uri: '/movies'
			}),
			TaskEither.map(getResponseData)
		)();
		expect(result).toEqualRight([
			{ id: '1', title: 'LOTR' },
			{ id: '2', title: 'Marvel' },
			{ id: '3', title: 'Star Wars' }
		]);
	});

	it('modifies mirage data with request', () => {
		throw new Error();
	});
});
