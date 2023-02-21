import { createContext } from 'react';

// TODO delete all of this
export interface RefreshTimerContextValue {
	readonly refreshTimestamp: string;
}

export const RefreshTimerContext = createContext<RefreshTimerContextValue>({
	refreshTimestamp: ''
});
