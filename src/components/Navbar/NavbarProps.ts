import { MenuInfo } from 'rc-menu/lib/interface';

export interface NavbarProps {
	selectedPageKey: string;
	selectedTimeKey: string;
	handleMenuClick: (mi: MenuInfo) => void;
}
