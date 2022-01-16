import { isDesktop } from '../utils/Breakpoints';
import { match, when } from 'ts-pattern';
import { DesktopNavbar } from './DesktopNavbar';
import { MobileNavbar } from './MobileNavbar';
import { Updater, useImmer } from 'use-immer';
import { MenuInfo } from 'rc-menu/lib/interface';
import { FC, useContext, useEffect } from 'react';
import { isMenuItemKey, MenuItemKey } from './MenuItemKey';
import { NavbarProps } from './NavbarProps';
import { ScreenContext } from '../ScreenContext';
import { useNavbarAuthCheck } from './useNavbarAuthStatus';
import { NavigateFunction, useLocation, useNavigate } from 'react-router';
import { captureFromRegex } from '../../function/Regex';
import { pipe } from 'fp-ts/es6/function';
import * as Option from 'fp-ts/es6/Option';

interface State {
	selected: MenuItemKey;
}

const initState: State = {
	selected: 'portfolios'
};

const createHandleMenuClick =
	(setState: Updater<State>, navigate: NavigateFunction) =>
	(menuItemInfo: MenuInfo): void =>
		match(menuItemInfo.key as MenuItemKey)
			.with('auth', () => {
				// Do nothing for now
			})
			.otherwise((key) => {
				navigate(`/market-tracker/${key}`);
				setState((draft) => {
					draft.selected = key;
				});
			});

const PATH_REGEX = /^\/market-tracker\/(?<key>.*)\/?.*$/;

interface PathRegexGroups {
	key: string;
}

export const Navbar: FC<object> = () => {
	const location = useLocation();
	const navigate = useNavigate();
	const { breakpoints } = useContext(ScreenContext);
	const [state, setState] = useImmer<State>(initState);
	const [isAuthorized, hasChecked, authBtnTxt, authBtnAction] =
		useNavbarAuthCheck();

	const handleMenuClick = createHandleMenuClick(setState, navigate);

	useEffect(() => {
		pipe(
			captureFromRegex<PathRegexGroups>(PATH_REGEX, location.pathname),
			Option.filter((_) => isMenuItemKey(_.key)),
			Option.map((groups) => {
				setState((draft) => {
					draft.selected = groups.key as MenuItemKey;
				});
			})
		);
	}, [location.pathname, setState]);

	const props: NavbarProps = {
		selected: state.selected,
		handleMenuClick,
		isAuthorized,
		hasChecked,
		authBtnTxt,
		authBtnAction
	};

	return match(breakpoints)
		.with(when(isDesktop), () => <DesktopNavbar {...props} />)
		.otherwise(() => <MobileNavbar {...props} />);
};
