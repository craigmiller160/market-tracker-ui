import { MenuItemKey } from './MenuItemKey';
import { MenuInfo } from 'rc-menu/lib/interface';

export interface NavbarProps {
	selected: MenuItemKey;
	handleMenuClick: (mi: MenuInfo) => void;
}
