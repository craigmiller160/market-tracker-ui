import { isDesktop } from '../utils/Breakpoints';
import { match, when } from 'ts-pattern';
import { DesktopNavbar } from './DesktopNavbar';
import { MobileNavbar } from './MobileNavbar';
import { Updater, useImmer } from 'use-immer';
import { MenuInfo } from 'rc-menu/lib/interface';
import { FC, useContext } from 'react';
import { MenuItemKey } from './MenuItemKey';
import { NavbarProps } from './NavbarProps';
import { ScreenContext } from '../ScreenContext';
import { useNavbarAuthCheck } from './useNavbarAuthStatus';

interface State {
	selected: MenuItemKey;
}

const initState: State = {
	selected: 'portfolios'
};

const createHandleMenuClick =
	(setState: Updater<State>) =>
	(menuItemInfo: MenuInfo): void =>
		match(menuItemInfo.key as MenuItemKey)
			.with('auth', () => {
				// Do nothing for now
			})
			.otherwise((_) =>
				setState((draft) => {
					draft.selected = _;
				})
			);

export const Navbar: FC<object> = () => {
	const { breakpoints } = useContext(ScreenContext);
	const [state, setState] = useImmer<State>(initState);
	const [isAuthorized, authBtnTxt, authBtnAction] = useNavbarAuthCheck();

	const handleMenuClick = createHandleMenuClick(setState);

	const props: NavbarProps = {
		selected: state.selected,
		handleMenuClick,
		isAuthorized,
		authBtnTxt,
		authBtnAction
	};

	return match(breakpoints)
		.with(when(isDesktop), () => <DesktopNavbar {...props} />)
		.otherwise(() => <MobileNavbar {...props} />);
};
