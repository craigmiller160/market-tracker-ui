import * as TE from 'fp-ts/es6/TaskEither';
import { AuthCodeLogin, AuthUser } from '../types/auth';
import { ajaxApi } from './AjaxApi';
import { pipe } from 'fp-ts/es6/function';
import { isAxiosError } from '@craigmiller160/ajax-api-fp-ts';
import { AxiosResponse } from 'axios';
import { store } from '../store';
import { authSlice } from '../store/auth/slice';
import * as O from 'fp-ts/es6/Option';

export const getAuthUser = (): TE.TaskEither<Error, AuthUser> =>
	pipe(
		ajaxApi.get<AuthUser>({
			uri: '/oauth/user',
			errorMsg: 'Error getting authenticated user',
			suppressError: (ex: Error) => {
				if (isAxiosError(ex)) {
					return ex.response?.status === 401;
				}
				return false;
			}
		}),
		TE.map((res: AxiosResponse<AuthUser>) => res.data)
	);

export const login = (): TE.TaskEither<Error, AuthCodeLogin> =>
	pipe(
		ajaxApi.post<void, AuthCodeLogin>({
			uri: '/oauth/authcode/login',
			errorMsg: 'Error getting login URI'
		}),
		TE.map((_) => _.data),
		TE.map((_) => {
			window.location.assign(_.url);
			return _;
		})
	);

export const logout = (): TE.TaskEither<Error, void> =>
	pipe(
		ajaxApi.get<void>({
			uri: '/oauth/logout',
			errorMsg: 'Error logging out'
		}),
		TE.map((_) => {
			console.log('Finished')
			store.dispatch(authSlice.actions.setUserData(O.none));
			console.log('AfterAction')
			return _.data;
		})
	);
