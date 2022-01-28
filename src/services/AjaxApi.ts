import { createApi } from '@craigmiller160/ajax-api-fp-ts';
import { store } from '../store';
import createAjaxErrorHandler from '@craigmiller160/ajax-error-handler';
import { AxiosResponse } from 'axios';
import { authSlice } from '../store/auth/slice';
import * as O from 'fp-ts/es6/Option';
import { alertSlice } from '../store/alert/slice';

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
		store.dispatch(alertSlice.actions.showError(message));
	},
	unauthorizedHandler: () =>
		store.dispatch(authSlice.actions.setUserData(O.none))
});

export const ajaxApi = createApi({
	baseURL: '/market-tracker/api',
	useCsrf: false,
	defaultErrorHandler: ajaxErrorHandler
});
