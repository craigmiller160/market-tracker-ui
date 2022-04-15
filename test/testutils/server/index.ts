import { createServer } from 'miragejs';

createServer({
	seeds(server) {
		server.db.loadData({
			movies: [
				{ title: 'LOTR' },
				{ title: 'Marvel' },
				{ title: 'Star Wars' }
			]
		});
	},
	routes() {
		this.namespace = '/market-tracker/api';

		// TODO how to properly type schema.db?
		this.get('/movies', (schema) => schema.db.movies);
	}
});
