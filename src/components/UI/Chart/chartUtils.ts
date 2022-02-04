import { HistoryRecord } from '../../../types/history';
import { flow } from 'fp-ts/es6/function';
import * as RArray from 'fp-ts/es6/ReadonlyArray';
import * as Option from 'fp-ts/es6/Option';

export const getFirstPrice: (history: ReadonlyArray<HistoryRecord>) => number =
	flow(
		RArray.head,
		Option.fold(
			() => 0,
			(_) => _.price
		)
	);
