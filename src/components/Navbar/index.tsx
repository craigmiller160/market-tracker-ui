import { Breakpoints, isDesktop } from '../utils/Breakpoints';
import useBreakpoint from 'antd/es/grid/hooks/useBreakpoint';
import { match, when } from 'ts-pattern';
import { DesktopNavbar } from './DesktopNavbar';
import { MobileNavbar } from './MobileNavbar';
import { Updater, useImmer } from 'use-immer';
import { MenuInfo } from 'rc-menu/lib/interface';
import { FC } from 'react';
import { MenuItemKey } from './MenuItemKey';
import { NavbarProps } from './NavbarProps';

interface State {
	selected: MenuItemKey;
}

const initState: State = {
	selected: ''
};

const createHandleMenuClick =
	(setState: Updater<State>) =>
	(menuItemInfo: MenuInfo): void =>
		match(menuItemInfo.key)
			.with('auth', () =>
				setState((draft) => {
					draft.selected = '';
				})
			)
			.otherwise((_) =>
				setState((draft) => {
					draft.selected = _;
				})
			);

export const Navbar: FC<void> = () => {
	const breakpoints: Breakpoints = useBreakpoint();
	const [state, setState] = useImmer<State>(initState);

	const handleMenuClick = createHandleMenuClick(setState);

	const props: NavbarProps = {
		selected: state.selected,
		handleMenuClick
	};

	return match(breakpoints)
		.with(when(isDesktop), () => <DesktopNavbar {...props} />)
		.otherwise(() => <MobileNavbar {...props} />);
};
