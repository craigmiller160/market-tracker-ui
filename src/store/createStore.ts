import { combineReducers } from 'redux';
import { authSlice } from './auth/slice';
import { configureStore } from '@reduxjs/toolkit';
import { timeSlice } from './time/slice';
import { notificationSlice } from './notification/slice';

export const rootReducer = combineReducers({
	auth: authSlice.reducer,
	time: timeSlice.reducer,
	notification: notificationSlice.reducer
});

type RootState = ReturnType<typeof rootReducer>;

export const createStore = (preloadedState?: Partial<RootState>) =>
	configureStore({
		reducer: rootReducer,
		preloadedState,
		devTools: process.env.NODE_ENV !== 'production'
	});
