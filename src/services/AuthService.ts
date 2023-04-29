import { AuthUser } from '../types/auth';
import { marketTrackerApi, getResponseData } from './AjaxApi';
import { isAxiosError } from '@craigmiller160/ajax-api-fp-ts';

export const getAuthUser = (): Promise<AuthUser> =>
	marketTrackerApi
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
