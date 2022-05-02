import { Database } from '../Database';
import { Server } from 'miragejs/server';
import { Response } from 'miragejs';
import { match } from 'ts-pattern';
import * as Option from 'fp-ts/es6/Option';
import { pipe } from 'fp-ts/es6/function';

export const createOAuthRoutes = (database: Database, server: Server) => {
	server.get('/oauth/user', () =>
		match(database.data.authUser)
			.when(
				Option.isSome,
				() =>
					new Response(
						200,
						{},
						pipe(
							database.data.authUser,
							Option.getOrElse(() => ({ userId: -1 }))
						)
					)
			)
			.otherwise(() => new Response(401))
	);
};
