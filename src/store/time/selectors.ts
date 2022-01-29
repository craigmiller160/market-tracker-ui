import { RootState } from '../index';

export const timeMenuKeySelector = (state: RootState): string =>
	state.time.menuKey;

export const timeValueSelector = (state: RootState): string => state.time.value;
