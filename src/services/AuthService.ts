import * as TE from 'fp-ts/es6/TaskEither';
import { AuthUser } from '../types/auth';
import { ajaxApiFpTs } from './AjaxApi';
import { pipe } from 'fp-ts/es6/function';
import { isAxiosError } from '@craigmiller160/ajax-api-fp-ts';
import { AxiosResponse } from 'axios';

export const getAuthUser = (): TE.TaskEither<Error, AuthUser> =>
	pipe(
		ajaxApiFpTs.get<AuthUser>({
			uri: '/oauth/user',
			errorCustomizer: 'Error getting authenticated user',
			suppressError: (ex: Error) => {
				if (isAxiosError(ex)) {
					return ex.response?.status === 401;
				}
				return false;
			}
		}),
		TE.map((res: AxiosResponse<AuthUser>) => res.data)
	);
