import { createServer } from 'miragejs';
import { Server } from 'miragejs/server';

export const newApiServer = (): Server =>
	createServer({
		routes() {
			this.namespace = '/market-tracker/api';
		}
	});
