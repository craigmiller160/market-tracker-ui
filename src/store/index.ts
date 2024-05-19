import { createStore } from './createStore';
import { useDispatch } from 'react-redux';

export const store = createStore();
export type StoreDispatch = typeof store.dispatch;

export const useStoreDispatch: () => StoreDispatch = useDispatch;
