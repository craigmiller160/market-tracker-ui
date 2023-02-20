import { AuthUser } from '../types/auth';
import { ajaxApi, getResponseData } from './AjaxApi';
import { isAxiosError } from '@craigmiller160/ajax-api-fp-ts';

export const getAuthUser = (): Promise<AuthUser> =>
	ajaxApi
		.get<AuthUser>({
			uri: '/oauth/user',
			errorCustomizer: 'Error getting authenticated user',
			suppressError: (ex: Error) => {
				if (isAxiosError(ex)) {
					return ex.response?.status === 401;
				}
				return false;
			}
		})
		.then(getResponseData);
