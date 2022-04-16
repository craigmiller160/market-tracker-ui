import { nanoid } from '@reduxjs/toolkit';
import { WritableDraft } from 'immer/dist/types/types-external';
import produce from 'immer';
import { DbWatchlist } from '../../../src/types/Watchlist';

export interface DbRecord {
	readonly _id: string;
}

export interface Data {
	readonly watchlists: ReadonlyArray<DbWatchlist>;
}

export const ensureDbRecord = <T extends object>(record: T): T & DbRecord => {
	if (
		Object.prototype.hasOwnProperty.call(record, '_id') &&
		(record as T & DbRecord)._id
	) {
		return record as T & DbRecord;
	}
	return {
		...record,
		_id: nanoid()
	};
};

export class Database {
	data: Data = {
		watchlists: []
	};

	updateData(updater: (draft: WritableDraft<Data>) => void) {
		this.data = produce(this.data, updater);
	}
}
