import { createContext } from 'react';

export interface TimerContextValue {
	readonly timestamp: string;
}

export const TimerContext = createContext<TimerContextValue>({
	timestamp: ''
});
