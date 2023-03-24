import { QueryClient } from '@tanstack/react-query';
import { isAxiosError } from '@craigmiller160/ajax-api-fp-ts';
import { store } from '../store';
import { notificationSlice } from '../store/notification/slice';

type ErrorResponse = {
	readonly message: string;
};

type CombinedErrorValues = {
	readonly message: string;
	readonly status?: number;
	readonly errorResponse?: ErrorResponse;
};

const isErrorResponse = (value: unknown): value is ErrorResponse =>
	!!value && typeof value === 'object' && Object.hasOwn(value, 'message');

const getCombinedErrorValues = (error: Error): CombinedErrorValues => {
	const messages: string[] = [];
	let baseError: Error | undefined = error;
	while (baseError != undefined) {
		messages.push(baseError.message);
		if (isAxiosError(baseError)) {
			const status = baseError.response?.status ?? -1;
			const body = baseError.response?.data;
			const errorResponse: ErrorResponse | undefined = isErrorResponse(
				body
			)
				? body
				: undefined;
			return {
				message: messages.join('; '),
				status,
				errorResponse
			};
		}
		baseError = baseError.cause as Error | undefined;
	}
	return {
		message: messages.join('; ')
	};
};

const onError = (error: unknown) => {
	if (error instanceof Error) {
		const combinedValues = getCombinedErrorValues(error);
		if (combinedValues.status === 400 && !!combinedValues.errorResponse) {
			store.dispatch(
				notificationSlice.actions.addError(
					combinedValues.errorResponse.message
				)
			);
		} else {
			store.dispatch(
				notificationSlice.actions.addError(combinedValues.message)
			);
		}
	}
};

export const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			refetchOnWindowFocus: false,
			cacheTime: 0,
			staleTime: 0,
			onError
		},
		mutations: {
			onError
		}
	}
});
