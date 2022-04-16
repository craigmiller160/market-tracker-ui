import { nanoid } from '@reduxjs/toolkit';
import { WritableDraft } from 'immer/dist/types/types-external';
import produce from 'immer';
import { DbWatchlist } from '../../../src/types/Watchlist';
import { DbRecord, UserRecord } from '../../../src/types/db';
import { OptionT } from '@craigmiller160/ts-functions/es/types';
import { AuthUser } from '../../../src/types/auth';
import * as Option from 'fp-ts/es6/Option';

const USER_ID = 1;

export interface Data {
	readonly authUser: OptionT<AuthUser>;
	readonly watchlists: ReadonlyArray<DbWatchlist>;
}

export const ensureDbRecord = <T extends object>(record: T): T & DbRecord => {
	if (
		Object.prototype.hasOwnProperty.call(record, '_id') &&
		(record as DbRecord)._id
	) {
		return record as T & DbRecord;
	}
	return {
		...record,
		_id: nanoid()
	};
};

export const ensureDbUserRecord = <T extends object>(
	record: T
): T & DbRecord & UserRecord => {
	const dbRecord = ensureDbRecord(record);
	type DbRecordType = typeof dbRecord;
	if (
		Object.prototype.hasOwnProperty.call(dbRecord, 'userId') &&
		(dbRecord as DbRecordType & UserRecord).userId
	) {
		return dbRecord as DbRecordType & UserRecord;
	}
	return {
		...dbRecord,
		userId: USER_ID
	};
};

export type DataUpdater = (draft: WritableDraft<Data>) => void;

export class Database {
	data: Data = {
		authUser: Option.none,
		watchlists: []
	};

	updateData(updater: DataUpdater) {
		this.data = produce(this.data, updater);
	}
}
