import { newTestServer } from './testutils/server';
import { ajaxApi, getResponseData } from '../src/services/AjaxApi';
import { pipe } from 'fp-ts/es6/function';
import * as TaskEither from 'fp-ts/es6/TaskEither';
import '@relmify/jest-fp-ts';
import { Server } from 'miragejs/server';

// TODO delete this in the end

interface MovieInput {
	readonly title: string;
}

interface Movie extends MovieInput {
	readonly id: string;
}

describe('mirage server', () => {
	let server: Server;
	beforeEach(() => {
		server = newTestServer();
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
		console.log(result);
		expect(result).toEqualRight([
			{ id: expect.any(String), title: 'LOTR' },
			{ id: expect.any(String), title: 'Marvel' },
			{ id: expect.any(String), title: 'Star Wars' }
		]);
	});

	it('modifies mirage data with request', async () => {
		const movieInput: MovieInput = {
			title: 'Disney'
		};
		const result = await pipe(
			ajaxApi.post<MovieInput, ReadonlyArray<Movie>>({
				uri: '/movies',
				body: movieInput
			}),
			TaskEither.map(getResponseData)
		)();
		expect(result).toEqualRight({
			id: expect.any(String),
			title: 'Disney'
		});

		const result2 = await pipe(
			ajaxApi.get<ReadonlyArray<Movie>>({
				uri: '/movies'
			}),
			TaskEither.map(getResponseData)
		)();
		expect(result2).toEqualRight([
			{ id: expect.any(String), title: 'LOTR' },
			{ id: expect.any(String), title: 'Marvel' },
			{ id: expect.any(String), title: 'Star Wars' },
			{ id: expect.any(String), title: 'Disney' }
		]);
	});
});
