import type { Database } from '../Database';
import { http, HttpResponse, RequestHandler, type StrictResponse } from 'msw';
import * as Option from 'fp-ts/Option';
import * as func from 'fp-ts/function';
import type { AuthUser } from '../../../../src/types/auth';

export const createOAuthHandlers = (
    database: Database
): ReadonlyArray<RequestHandler> => {
    const getUserHandler = http.get(
        'http://localhost:3000/market-tracker/api/oauth/user',
        () => {
            return func.pipe(
                database.data.authUser,
                Option.fold(
                    (): StrictResponse<string | AuthUser> =>
                        HttpResponse.text('', {
                            status: 401
                        }),
                    (user): StrictResponse<string | AuthUser> =>
                        HttpResponse.json(user)
                )
            );
        }
    );
    return [getUserHandler];
};
