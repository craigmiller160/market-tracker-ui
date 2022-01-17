import { combineReducers } from 'redux';
import { authSlice } from './auth/slice';
import { configureStore } from '@reduxjs/toolkit';

export const rootReducer = combineReducers({
	auth: authSlice.reducer
});

type RootState = ReturnType<typeof rootReducer>;

export const createStore = (preloadedState?: Partial<RootState>) =>
	configureStore({
		reducer: rootReducer,
		preloadedState,
		devTools: process.env.NODE_ENV !== 'production'
	});
