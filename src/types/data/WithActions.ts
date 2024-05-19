import { type ReactNode } from 'react';

export type WithActions = Readonly<{
    getActions?: (symbol: string) => ReactNode[];
}>;
