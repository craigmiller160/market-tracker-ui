import './testutils/server';
import { ajaxApi, getResponseData } from '../src/services/AjaxApi';
import { pipe } from 'fp-ts/es6/function';
import * as TaskEither from 'fp-ts/es6/TaskEither';
import '@relmify/jest-fp-ts';

// TODO delete this in the end

describe('mirage server', () => {
	it('gets data with request', async () => {
		const result = await pipe(
			ajaxApi.get<ReadonlyArray<string>>({
				uri: '/movies'
			}),
			TaskEither.map(getResponseData)
		)();
		expect(result).toEqualRight(['LOTR', 'Marvel', 'Star Wars']);
	});

	it('modifies mirage data with request', () => {
		throw new Error();
	});
});
