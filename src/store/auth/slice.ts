import * as O from 'fp-ts/Option';
import { type AuthUser } from '../../types/auth';
import { createSlice, type PayloadAction, type Draft } from '@reduxjs/toolkit';

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

const reset = (draft: Draft<StateType>) => {
    draft.userData = O.none;
    draft.hasChecked = false;
};

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setUserData,
        reset
    }
});
