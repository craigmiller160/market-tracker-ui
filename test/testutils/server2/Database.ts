import { nanoid } from '@reduxjs/toolkit';
import { WritableDraft } from 'immer/dist/types/types-external';
import produce from 'immer';

export interface DbRecord {
	readonly _id: string;
}

export interface Data {}

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
		movies: []
	};

	updateData(updater: (draft: WritableDraft<Data>) => void) {
		this.data = produce(this.data, updater);
	}
}

export const database = new Database();
