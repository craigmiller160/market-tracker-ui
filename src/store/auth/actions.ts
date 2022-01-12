import * as TE from 'fp-ts/es6/TaskEither';
import * as O from 'fp-ts/es6/Option';
import * as T from 'fp-ts/es6/Task';

import { Dispatch } from 'redux';
import { AuthUser } from '../../types/auth';
import { pipe } from 'fp-ts/es6/function';
import { getAuthUser } from '../../services/AuthService';
import { authSlice } from './slice';

// TODO write tests for this

export const loadAuthUser =
	() =>
	(dispatch: Dispatch): Promise<O.Option<AuthUser>> =>
		pipe(
			getAuthUser(),
			TE.fold(
				() => {
					const authUser = O.none;
					dispatch(authSlice.actions.setUserData(authUser));
					return T.of(authUser);
				},
				(authUser: AuthUser) => {
					const theAuthUser = O.some(authUser);
					dispatch(authSlice.actions.setUserData(theAuthUser));
					return T.of(theAuthUser);
				}
			)
		)();
