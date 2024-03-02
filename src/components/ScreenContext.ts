import { createContext } from 'react';
import { type Breakpoints } from './utils/Breakpoints';

export interface ScreenContextValue {
	readonly breakpoints: Breakpoints;
}

export const ScreenContext = createContext<ScreenContextValue>({
	breakpoints: {}
});
