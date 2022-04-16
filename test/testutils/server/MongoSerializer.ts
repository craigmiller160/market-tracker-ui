import { RestSerializer } from 'miragejs';

export const MongoSerializer = RestSerializer.extend({
	keyForAttribute(attr: string): string {
		console.log('Attr', attr);
		return 'id' === attr ? '_id' : attr;
	},
	serialize(primaryResource: any, request: any): any {
		console.log('SERIALIZING');
        return null;
	}
});
