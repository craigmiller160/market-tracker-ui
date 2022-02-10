import { TaskTryT } from '@craigmiller160/ts-functions/es/types';
import { Quote } from '../types/quote';
import { pipe } from 'fp-ts/es6/function';
import { ajaxApi } from './AjaxApi';

export const getQuotes = (
	symbols: ReadonlyArray<string>
): TaskTryT<ReadonlyArray<Quote>> => {
	pipe(
		ajaxApi.get<any>({
			uri: `/cryptogecko/simple/price?ids=${symbols.join(
				','
			)}&vs_currencies=usd`
		})
	);
    throw new Error();
};
