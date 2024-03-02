import { Database } from '../../msw-server/Database';
import { Server } from 'miragejs/server';
import { Response } from 'miragejs';
import { match } from 'ts-pattern';
import * as Option from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';

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
							Option.getOrElse(() => ({ userId: '' }))
						)
					)
			)
			.otherwise(() => new Response(401))
	);
};
