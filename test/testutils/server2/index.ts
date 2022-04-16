import { createServer } from 'miragejs';
import { Server } from 'miragejs/server';
import produce from 'immer';
import { WritableDraft } from 'immer/dist/types/types-external';

export interface MovieInput {
	readonly title: string;
}

export interface Movie extends MovieInput {
	readonly _id: string;
}

interface Data {
	readonly movies: ReadonlyArray<Movie>;
}

class Database {
	data: Data = {
		movies: []
	};

	updateData(updater: (draft: WritableDraft<Data>) => void) {
		this.data = produce(this.data, updater);
	}
}

const movies: ReadonlyArray<Movie> = [];

export const newApiServer = (): Server =>
	createServer({
		routes() {
			this.namespace = '/market-tracker/api';
		}
	});
