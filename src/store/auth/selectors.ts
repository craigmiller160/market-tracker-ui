import { RootState } from '../index';
import { createSelector } from '@reduxjs/toolkit';
import * as O from 'fp-ts/es6/Option';
import { AuthUser } from '../../types/auth';

export const hasCheckedSelector = (state: RootState): boolean =>
	state.auth.hasChecked;

const userDataSelector = (state: RootState): O.Option<AuthUser> =>
	state.auth.userData;

export const isAuthorized = createSelector(
	userDataSelector,
	(userData: O.Option<AuthUser>) => O.isSome(userData)
);
