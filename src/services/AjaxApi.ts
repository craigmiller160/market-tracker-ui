import { createBaseApi, wrapApi } from '@craigmiller160/ajax-api-fp-ts';
import { type AxiosResponse } from 'axios';

export const getResponseData = <T>(res: AxiosResponse<T>): T => res.data;

export const marketTrackerApi = createBaseApi({
	baseURL: '/market-tracker/api',
	useCsrf: false
});

export const marketTrackerPortfoliosApi = createBaseApi({
	baseURL: '/market-tracker/portfolios',
	useCsrf: false
});

export const marketTrackerApiFpTs = wrapApi(marketTrackerApi);
