import { createStore, rootReducer } from './createStore';
import { useDispatch } from 'react-redux';

export type RootState = ReturnType<typeof rootReducer>;
export const store = createStore();
export type StoreType = typeof store;
export type StoreDispatch = typeof store.dispatch;

export const useStoreDispatch: () => StoreDispatch = useDispatch;
