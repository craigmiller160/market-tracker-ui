import { createStore, rootReducer } from './createStore';

export type RootState = ReturnType<typeof rootReducer>;

export const store = createStore();
