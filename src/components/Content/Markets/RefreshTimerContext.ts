import { createContext } from 'react';

export interface RefreshTimerContextValue {
	readonly refreshTimestamp: string;
}

export const RefreshTimerContext = createContext<RefreshTimerContextValue>({
	refreshTimestamp: ''
});
