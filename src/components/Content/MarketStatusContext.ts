import { MarketStatus } from '../../types/MarketStatus';
import { createContext } from 'react';

export interface MarketStatusContextValue {
	readonly status: MarketStatus;
}

export const MarketStatusContext = createContext<MarketStatusContextValue>({
	status: MarketStatus.UNKNOWN
});
