import { isDesktop } from '../utils/Breakpoints';
import { match, when } from 'ts-pattern';
import { DesktopNavbar } from './DesktopNavbar';
import { MobileNavbar } from './MobileNavbar';
import { Updater, useImmer } from 'use-immer';
import { MenuInfo } from 'rc-menu/lib/interface';
import { FC, useCallback, useContext, useEffect } from 'react';
import { isMenuItemKey, MenuItemKey } from './MenuItemKey';
import { NavbarProps } from './NavbarProps';
import { ScreenContext } from '../ScreenContext';
import { useNavbarAuthCheck } from './useNavbarAuthStatus';
import { NavigateFunction, useLocation, useNavigate } from 'react-router';
import * as Regex from '@craigmiller160/ts-functions/es/Regex';
import { pipe } from 'fp-ts/es6/function';
import * as Option from 'fp-ts/es6/Option';

interface State {
	selected: MenuItemKey;
}

const initState: State = {
	selected: 'portfolios'
};

interface PathRegexGroups {
	key: string;
}

const PATH_REGEX = /^\/market-tracker\/(?<key>.*)\/?.*$/;
const capturePathKey = Regex.capture<PathRegexGroups>(PATH_REGEX);

const useHandleMenuClick = (
	setState: Updater<State>,
	navigate: NavigateFunction
) =>
	useCallback(
		(menuItemInfo: MenuInfo) =>
			match(menuItemInfo.key as MenuItemKey)
				.with('auth', () => {
					// Do nothing for now
				})
				.otherwise((key) => {
					navigate(`/market-tracker/${key}`);
					setState((draft) => {
						draft.selected = key;
					});
				}),
		[setState, navigate]
	);

const useSetSelectedFromLocation = (setState: Updater<State>) =>
	useCallback(
		(pathname: string) =>
			pipe(
				capturePathKey(pathname),
				Option.filter((_) => isMenuItemKey(_.key)),
				Option.map((groups) => {
					setState((draft) => {
						draft.selected = groups.key as MenuItemKey;
					});
					return groups;
				})
			),
		[setState]
	);

export const Navbar: FC<object> = () => {
	const location = useLocation();
	const navigate = useNavigate();
	const { breakpoints } = useContext(ScreenContext);
	const [state, setState] = useImmer<State>(initState);
	const [isAuthorized, hasChecked, authBtnTxt, authBtnAction] =
		useNavbarAuthCheck();

	const handleMenuClick = useHandleMenuClick(setState, navigate);
	const setSelectedFromLocation = useSetSelectedFromLocation(setState);

	useEffect(() => {
		setSelectedFromLocation(location.pathname);
	}, [location.pathname, setSelectedFromLocation]);

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
