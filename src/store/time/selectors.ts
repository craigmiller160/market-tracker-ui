import { RootState } from '../index';
import { MarketTime } from '../../types/MarketTime';

export const timeMenuKeySelector = (state: RootState): string =>
	state.time.menuKey;

export const timeValueSelector = (state: RootState): MarketTime =>
	state.time.value;
