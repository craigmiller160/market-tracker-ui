import { RootState } from '../index';
import { MenuItemTimeKey } from '../../components/Navbar/MenuItemKey';

export const timeMenuKeySelector = (state: RootState): MenuItemTimeKey =>
	state.time.menuKey;

export const timeValueSelector = (state: RootState): string => state.time.value;
