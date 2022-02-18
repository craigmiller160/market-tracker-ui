import { createContext } from 'react';

export interface TodayContextValue {
	readonly timestamp: string;
}

export const TodayContext = createContext<TodayContextValue>({
	timestamp: ''
});
