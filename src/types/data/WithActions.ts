import { type ReactNode } from 'react';

export interface WithActions {
	readonly getActions?: (symbol: string) => ReactNode[];
}
