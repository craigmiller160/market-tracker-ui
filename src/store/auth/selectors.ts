import { type RootState } from '../createStore';
import { createSelector } from '@reduxjs/toolkit';
import * as O from 'fp-ts/Option';
import { type AuthUser } from '../../types/auth';

export const hasCheckedSelector = (state: RootState): boolean =>
    state.auth.hasChecked;

const userDataSelector = (state: RootState): O.Option<AuthUser> =>
    state.auth.userData;

export const isAuthorizedSelector = createSelector(
    userDataSelector,
    (userData: O.Option<AuthUser>) => O.isSome(userData)
);
