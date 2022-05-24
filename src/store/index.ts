import { createStore, rootReducer } from './createStore';

export type RootState = ReturnType<typeof rootReducer>;
export const store = createStore();
export type StoreType = typeof store;
export type StoreDispatch = typeof store.dispatch;
