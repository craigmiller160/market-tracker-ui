import { combineReducers } from 'redux';
import { authSlice } from './auth/slice';
import { configureStore } from '@reduxjs/toolkit';

const rootReducer = combineReducers({
	auth: authSlice.reducer
});

export type RootState = ReturnType<typeof rootReducer>;

export const store = configureStore({
	reducer: rootReducer,
	devTools: process.env.NODE_ENV !== 'production'
});
