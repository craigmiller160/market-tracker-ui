import { createServer } from 'miragejs';

createServer({
	routes() {
		this.namespace = '/market-tracker/api';

		this.get('/movies', () => ['LOTR', 'Marvel', 'Star Wars']);
	}
});
