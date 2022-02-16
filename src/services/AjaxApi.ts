import {
	createApi,
	DefaultErrorHandler,
	isAxiosError
} from '@craigmiller160/ajax-api-fp-ts';
import { store } from '../store';
import createAjaxErrorHandler from '@craigmiller160/ajax-error-handler';
import { AxiosResponse } from 'axios';
import { authSlice } from '../store/auth/slice';
import * as Option from 'fp-ts/es6/Option';
import { notificationSlice } from '../store/notification/slice';
import { AxiosError } from 'axios';
import { match, when } from 'ts-pattern';

interface ErrorResponse {
	status: number;
	message: string;
}

const isErrorResponse = (
	data?: Partial<ErrorResponse>
): data is ErrorResponse =>
	data?.status !== undefined && data?.message !== undefined;

// TODO delete this
const ajaxErrorHandler2 = createAjaxErrorHandler({
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

const handleAxiosError = (error: AxiosError<unknown>) => {};

const ajaxErrorHandler: DefaultErrorHandler = (status, error, message) => {
	match(error)
		.with(when(isAxiosError), () =>
			handleAxiosError(error as AxiosError<unknown>)
		)
		.otherwise(() => {
			store.dispatch(notificationSlice.actions.addError(error.message));
		});
};

export const getResponseData = <T>(res: AxiosResponse<T>): T => res.data;

export const ajaxApi = createApi({
	baseURL: '/market-tracker/api',
	useCsrf: false,
	defaultErrorHandler: ajaxErrorHandler
});
