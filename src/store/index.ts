import { createStore, rootReducer } from './createStore';
import { PayloadAction, ThunkAction } from '@reduxjs/toolkit';

export type RootState = ReturnType<typeof rootReducer>;
export type AppThunkAction<R> = ThunkAction<
	R,
	RootState,
	unknown,
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	PayloadAction<any>
>;

export const store = createStore();
