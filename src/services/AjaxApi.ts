import { createBaseApi, wrapApi } from '@craigmiller160/ajax-api-fp-ts';
import { AxiosResponse } from 'axios';

export const getResponseData = <T>(res: AxiosResponse<T>): T => res.data;

export const ajaxApi = createBaseApi({
	baseURL: '/market-tracker/api',
	useCsrf: false
});

export const ajaxApiFpTs = wrapApi(ajaxApi);
