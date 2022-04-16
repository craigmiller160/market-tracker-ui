import { newApiServer } from './testutils/server';
import { ajaxApi, getResponseData } from '../src/services/AjaxApi';
import { pipe } from 'fp-ts/es6/function';
import * as TaskEither from 'fp-ts/es6/TaskEither';
import '@relmify/jest-fp-ts';
import { Server } from 'miragejs/server';

// TODO delete this in the end

export interface Movie {
	readonly title: string;
}

describe('mirage server', () => {
	let server: Server;
	beforeEach(() => {
		server = newApiServer();
	});

	afterEach(() => {
		server.shutdown();
	});

	it('gets data with request', async () => {
		const result = await pipe(
			ajaxApi.get<ReadonlyArray<Movie>>({
				uri: '/movies'
			}),
			TaskEither.map(getResponseData)
		)();
		expect(result).toEqualRight([
			{ _id: expect.any(String), title: 'LOTR' },
			{ _id: expect.any(String), title: 'Marvel' },
			{ _id: expect.any(String), title: 'Star Wars' }
		]);
	});

	it('modifies mirage data with request', async () => {
		const movieInput: Movie = {
			title: 'Disney'
		};
		const result = await pipe(
			ajaxApi.post<Movie, ReadonlyArray<Movie>>({
				uri: '/movies',
				body: movieInput
			}),
			TaskEither.map(getResponseData)
		)();
		expect(result).toEqualRight({
			_id: expect.any(String),
			title: 'Disney'
		});

		const result2 = await pipe(
			ajaxApi.get<ReadonlyArray<Movie>>({
				uri: '/movies'
			}),
			TaskEither.map(getResponseData)
		)();
		expect(result2).toEqualRight([
			{ _id: expect.any(String), title: 'LOTR' },
			{ _id: expect.any(String), title: 'Marvel' },
			{ _id: expect.any(String), title: 'Star Wars' },
			{ _id: expect.any(String), title: 'Disney' }
		]);
	});
});
