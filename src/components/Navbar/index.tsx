import { isDesktop } from '../utils/Breakpoints';
import { match, select, when } from 'ts-pattern';
import { DesktopNavbar } from './DesktopNavbar';
import { MobileNavbar } from './MobileNavbar';
import { Updater, useImmer } from 'use-immer';
import { MenuInfo } from 'rc-menu/lib/interface';
import { FC, useCallback, useContext, useEffect } from 'react';
import { NavbarProps } from './NavbarProps';
import { ScreenContext } from '../ScreenContext';
import { useNavbarAuthCheck } from './useNavbarAuthStatus';
import { NavigateFunction, useLocation, useNavigate } from 'react-router';
import * as Regex from '@craigmiller160/ts-functions/es/Regex';
import { pipe } from 'fp-ts/es6/function';
import * as Option from 'fp-ts/es6/Option';
import { PredicateT } from '@craigmiller160/ts-functions/es/types';
import { MenuItemPageKey } from './MenuItemKey';

interface State {
	readonly selectedPageKey: MenuItemPageKey;
}

const initState: State = {
	selectedPageKey: 'page.portfolios'
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
			// TODO add better null handling
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
								draft.selectedPageKey =
									menuItemInfo.key as MenuItemPageKey; // TODO guard to avoid casting
							});
						})
						.with({ prefix: 'time', action: select() }, (_) => {
							console.log('Time', _);
						})
						.run()
				)
			);
		},
		[setState, navigate]
	);

const isMenuPageKey: PredicateT<string> = (key) =>
	['portfolios', 'watchlists'].includes(key);

const useSetSelectedFromLocation = (setState: Updater<State>) =>
	useCallback(
		(pathname: string) =>
			pipe(
				capturePathKey(pathname),
				Option.filter((_) => isMenuPageKey(_.key)),
				Option.map((groups) => {
					setState((draft) => {
						draft.selectedPageKey =
							`page.${groups.key}` as MenuItemPageKey; // TODO guard to avoid casting
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
		selectedPageKey: state.selectedPageKey,
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
