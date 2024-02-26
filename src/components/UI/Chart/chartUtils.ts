import { type HistoryRecord } from '../../../types/history';
import { flow } from 'fp-ts/function';
import * as RArray from 'fp-ts/ReadonlyArray';
import * as Option from 'fp-ts/Option';

export const getFirstPrice: (history: ReadonlyArray<HistoryRecord>) => number =
	flow(
		RArray.head,
		Option.fold(
			() => 0,
			(_) => _.price
		)
	);
