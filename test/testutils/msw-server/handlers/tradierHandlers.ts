import type { Database } from '../Database';
import { HttpHandler } from 'msw';

export const createTradierHandlers = (
	database: Database
): ReadonlyArray<HttpHandler> => {
    return [];
};
