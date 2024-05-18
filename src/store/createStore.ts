import { combineReducers } from 'redux';
import { authSlice } from './auth/slice';
import { configureStore } from '@reduxjs/toolkit';
import { marketSettingsSlice } from './marketSettings/slice';
import { notificationSlice } from './notification/slice';

export const rootReducer = combineReducers({
	auth: authSlice.reducer,
	marketSettings: marketSettingsSlice.reducer,
	notification: notificationSlice.reducer
});

type RootState = ReturnType<typeof rootReducer>;

export const createStore = (preloadedState?: Partial<RootState>) =>
	configureStore({
		reducer: rootReducer,
		preloadedState,
		devTools: process.env.NODE_ENV !== 'production'
	});

export type StoreType = ReturnType<typeof createStore>;
