import {
	createApi,
	DefaultErrorHandler,
	isAxiosError
} from '@craigmiller160/ajax-api-fp-ts';
import { store } from '../store';
import { AxiosResponse } from 'axios';
import { authSlice } from '../store/auth/slice';
import * as Option from 'fp-ts/es6/Option';
import { notificationSlice } from '../store/notification/slice';
import { AxiosError } from 'axios';
import { match, when, not } from 'ts-pattern';
import * as Json from '@craigmiller160/ts-functions/es/Json';
import { pipe } from 'fp-ts/es6/function';

const isUndefined = (value: string | undefined): boolean => value === undefined;

const getAxiosErrorBody = (error: AxiosError<unknown>): string =>
	pipe(
		Json.stringifyO(error.response?.data ?? {}),
		Option.getOrElse(() => '')
	);

const getFullErrorMessage = (
	status: number,
	errorMsg: string | undefined,
	error: Error
) =>
	match({ errorMsg, error })
		.with(
			{ errorMsg: not(when(isUndefined)), error: when(isAxiosError) },
			() => {
				const responseBody = getAxiosErrorBody(
					error as AxiosError<unknown>
				);
				return `${status} - ${errorMsg} Message: ${error.message} Body: ${responseBody}`;
			}
		)
		.with(
			{ errorMsg: when(isUndefined), error: when(isAxiosError) },
			() => {
				const responseBody = getAxiosErrorBody(
					error as AxiosError<unknown>
				);
				return `${status} - Message: ${error.message} Body: ${responseBody}`;
			}
		)
		.otherwise(() => `${status} - Message: ${error.message}`);

const ajaxErrorHandler: DefaultErrorHandler = (status, error, message) => {
	if (status === 401) {
		store.dispatch(authSlice.actions.setUserData(Option.none));
	} else {
		store.dispatch(
			notificationSlice.actions.addError(
				getFullErrorMessage(status, message, error)
			)
		);
	}
};

export const getResponseData = <T>(res: AxiosResponse<T>): T => res.data;

export const ajaxApi = createApi({
	baseURL: '/market-tracker/api',
	useCsrf: false,
	defaultErrorHandler: ajaxErrorHandler
});
