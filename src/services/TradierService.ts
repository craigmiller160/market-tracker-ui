import { TaskTryT } from '@craigmiller160/ts-functions/es/types';
import { ajaxApi } from './AjaxApi';
import { pipe } from 'fp-ts/es6/function';
import * as TaskEither from 'fp-ts/es6/TaskEither';

// TODO make this an array
export const getQuotes = (symbols: string): TaskTryT<any> =>
	pipe(
		ajaxApi.get({
			uri: `/tradier/markets/quotes?symbols=${symbols}`
		}),
		TaskEither.map((_) => _.data)
	);
