import { createApi } from '@craigmiller160/ajax-api-fp-ts';
import { store } from '../store';
import createAjaxErrorHandler from '@craigmiller160/ajax-error-handler';
import { AxiosResponse } from 'axios';
import { authSlice } from '../store/auth/slice';
import * as Option from 'fp-ts/es6/Option';
import { notificationSlice } from '../store/notification/slice';

interface ErrorResponse {
	status: number;
	message: string;
}

const isErrorResponse = (
	data?: Partial<ErrorResponse>
): data is ErrorResponse =>
	data?.status !== undefined && data?.message !== undefined;

const ajaxErrorHandler = createAjaxErrorHandler({
	responseMessageExtractor: (response: AxiosResponse) => {
		if (isErrorResponse(response.data)) {
			return response.data.message;
		}
		return '';
	},
	errorMessageHandler: (message: string) => {
		store.dispatch(notificationSlice.actions.addError(message));
	},
	unauthorizedHandler: () =>
		store.dispatch(authSlice.actions.setUserData(Option.none))
});

export const getResponseData = <T>(res: AxiosResponse<T>): T => res.data;

export const ajaxApi = createApi({
	baseURL: '/market-tracker/api',
	useCsrf: false,
	defaultErrorHandler: ajaxErrorHandler
});
