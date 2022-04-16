import { createServer } from 'miragejs';
import { Server } from 'miragejs/server';
import produce, { castDraft } from 'immer';
import { WritableDraft } from 'immer/dist/types/types-external';
import { nanoid } from '@reduxjs/toolkit';

export interface Movie {
	readonly title: string;
}

interface DbRecord {
	readonly _id: string;
}

interface Data {
	readonly movies: ReadonlyArray<Movie & DbRecord>;
}

const ensureDbRecord = <T extends object>(record: T): T & DbRecord => {
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

class Database {
	data: Data = {
		movies: []
	};

	updateData(updater: (draft: WritableDraft<Data>) => void) {
		this.data = produce(this.data, updater);
	}
}

const database = new Database();
database.updateData((draft) => {
	draft.movies = castDraft([
		ensureDbRecord({
			title: 'LOTR'
		}),
		ensureDbRecord({
			title: 'Marvel'
		}),
		ensureDbRecord({
			title: 'Star Wars'
		})
	]);
});

export const newApiServer = (): Server =>
	createServer({
		routes() {
			this.namespace = '/market-tracker/api';

			this.get('/movies', () => database.data.movies);
			this.post('/movies', (schema, request) => {
				const movie = JSON.parse(request.requestBody) as Movie;
				const movieRecord = ensureDbRecord(movie);
				database.updateData((draft) => {
					draft.movies.push(movieRecord);
				});
				return movieRecord;
			});
		}
	});
