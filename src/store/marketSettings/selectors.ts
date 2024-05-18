import { type RootState } from '../createStore';
import { MarketTime } from '../../types/MarketTime';

export const timeMenuKeySelector = (state: RootState): string =>
	state.marketSettings.time.menuKey;

export const timeValueSelector = (state: RootState): MarketTime =>
	state.marketSettings.time.value;
