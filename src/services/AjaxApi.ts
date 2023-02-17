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
import { match, P } from 'ts-pattern';
import * as Json from '@craigmiller160/ts-functions/es/Json';
import { pipe } from 'fp-ts/es6/function';
import { debounce } from 'lodash-es';

const isUndefined = (value: string | undefined): boolean => value === undefined;

export const isNestedAxiosError = (ex: Error): ex is AxiosError =>
	match(ex)
		.with(
			{ cause: P.union(P.not(P.nullish), P.instanceOf(Error)) },
			({ cause }) => isNestedAxiosError(cause as Error)
		)
		.otherwise(
			(error) =>
				Object.prototype.hasOwnProperty.call(error, 'isAxiosError') &&
				Object.prototype.hasOwnProperty.call(error, 'config')
		);

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
			{
				errorMsg: P.not(P.when(isUndefined)),
				error: P.when(isAxiosError)
			},
			() => {
				const responseBody = getAxiosErrorBody(
					error as AxiosError<unknown>
				);
				return `${status} - ${errorMsg} Message: ${error.message} Body: ${responseBody}`;
			}
		)
		.with(
			{ errorMsg: P.when(isUndefined), error: P.when(isAxiosError) },
			() => {
				const responseBody = getAxiosErrorBody(
					error as AxiosError<unknown>
				);
				return `${status} - Message: ${error.message} Body: ${responseBody}`;
			}
		)
		.otherwise(() => `${status} - Message: ${error.message}`);

const debouncedUnauthorizedNotification = debounce(
	() => store.dispatch(notificationSlice.actions.addError('Unauthorized')),
	500
);

const ajaxErrorHandler: DefaultErrorHandler = (status, error) => {
	if (status === 401) {
		store.dispatch(authSlice.actions.setUserData(Option.none));
		debouncedUnauthorizedNotification();
	} else {
		store.dispatch(
			notificationSlice.actions.addError(
				getFullErrorMessage(status, undefined, error)
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
