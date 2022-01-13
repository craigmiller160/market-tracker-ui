import { RootState } from '../index';

export const hasCheckedSelector = (state: RootState): boolean =>
	state.auth.hasChecked;
