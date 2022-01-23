import * as O from 'fp-ts/es6/Option';
import { AuthUser } from '../../types/auth';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Draft } from '@reduxjs/toolkit';

interface StateType {
	readonly userData: O.Option<AuthUser>;
	readonly hasChecked: boolean;
}

const initialState: StateType = {
	userData: O.none,
	hasChecked: false
};

const setUserData = (
	draft: Draft<StateType>,
	action: PayloadAction<O.Option<AuthUser>>
) => {
	draft.userData = action.payload;
	draft.hasChecked = true;
};

export const authSlice = createSlice({
	name: 'auth',
	initialState,
	reducers: {
		setUserData
	}
});
