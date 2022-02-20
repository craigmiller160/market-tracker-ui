import { RootState } from '../index';
import { MarketTime } from '../../types/MarketTime';
import { MarketStatus } from '../../types/MarketStatus';

export const timeMenuKeySelector = (state: RootState): string =>
	state.marketSettings.time.menuKey;

export const timeValueSelector = (state: RootState): MarketTime =>
	state.marketSettings.time.value;

export const marketStatusSelector = (state: RootState): MarketStatus =>
	state.marketSettings.status;
