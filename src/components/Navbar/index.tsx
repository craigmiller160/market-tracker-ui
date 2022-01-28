import { isDesktop } from '../utils/Breakpoints';
import { match, select, when } from 'ts-pattern';
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
	readonly selected: string; // TODO need new type to restrict this
}

const initState: State = {
	selected: 'portfolios'
};

interface PathRegexGroups {
	readonly key: string;
}

interface MenuKeyParts {
	readonly prefix: string;
	readonly action: string;
}

const PATH_REGEX = /^\/market-tracker\/(?<key>.*)\/?.*$/;
const MENU_KEY_PARTS_REGEX = /^(?<prefix>.*)\.(?<action>.*)$/;
const capturePathKey = Regex.capture<PathRegexGroups>(PATH_REGEX);
const captureMenuKeyParts = Regex.capture<MenuKeyParts>(MENU_KEY_PARTS_REGEX);

const useHandleMenuClick = (
	setState: Updater<State>,
	navigate: NavigateFunction
) =>
	useCallback(
		(menuItemInfo: MenuInfo) => {
			pipe(
				captureMenuKeyParts(menuItemInfo.key),
				Option.map((keyParts) =>
					match(keyParts)
						.with({ prefix: 'auth' }, () => {
							// Do nothing for now
						})
						.with({ prefix: 'page', action: select() }, (page) => {
							navigate(`/market-tracker/${page}`);
							setState((draft) => {
								console.log('Key', menuItemInfo.key);
								draft.selected = menuItemInfo.key;
							})
						})
						.with({ prefix: 'time', action: select() }, (_) => {
							console.log('Time', _);
						})
						.run()
				)
			)
		},
		[setState, navigate]
	);

// TODO completely refactor how this works
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
		// TODO location.pathname triggers this too often... maybe...
		// setSelectedFromLocation(location.pathname);
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
