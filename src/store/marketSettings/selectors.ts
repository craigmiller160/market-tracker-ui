import { RootState } from '../index';
import { MarketTime } from '../../types/MarketTime';

export const timeMenuKeySelector = (state: RootState): string =>
	state.marketSettings.menuKey;

export const timeValueSelector = (state: RootState): MarketTime =>
	state.marketSettings.value;
