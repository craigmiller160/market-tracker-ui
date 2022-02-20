import { isDesktop } from '../utils/Breakpoints';
import { match, select, when } from 'ts-pattern';
import { DesktopNavbar } from './DesktopNavbar';
import { MobileNavbar } from './MobileNavbar';
import { Updater, useImmer } from 'use-immer';
import { MenuInfo } from 'rc-menu/lib/interface';
import { FC, useCallback, useContext, useEffect } from 'react';
import { NavbarProps } from './NavbarProps';
import { ScreenContext } from '../ScreenContext';
import { NavigateFunction, useLocation, useNavigate } from 'react-router';
import * as Regex from '@craigmiller160/ts-functions/es/Regex';
import { pipe } from 'fp-ts/es6/function';
import * as Option from 'fp-ts/es6/Option';
import { useDispatch, useSelector } from 'react-redux';
import { timeMenuKeySelector } from '../../store/marketSettings/selectors';
import { changeSelectedTime } from '../../store/marketSettings/actions';
import { StoreDispatch } from '../../store';

interface State {
	readonly selectedPageKey: string;
}

const initState: State = {
	selectedPageKey: 'page.markets'
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
	navigate: NavigateFunction,
	dispatch: StoreDispatch
) =>
	useCallback(
		(menuItemInfo: MenuInfo) => {
			const keyParts = pipe(
				captureMenuKeyParts(menuItemInfo.key),
				Option.getOrElse(() => ({
					prefix: '',
					action: ''
				}))
			);

			match(keyParts)
				.with({ prefix: 'auth' }, () => {
					// Do nothing for now
				})
				.with({ prefix: 'page', action: select() }, (page) => {
					navigate(`/market-tracker/${page}`);
				})
				.with({ prefix: 'time' }, () => {
					dispatch(changeSelectedTime(menuItemInfo.key));
				})
				.otherwise(() => {
					console.error('Invalid MenuInfo keyParts', keyParts);
					navigate('/market-tracker/');
				});
		},
		[navigate, dispatch]
	);

const useSetSelectedFromLocation = (setState: Updater<State>) =>
	useCallback(
		(pathname: string) =>
			pipe(
				capturePathKey(pathname),
				Option.map((groups) => {
					setState((draft) => {
						draft.selectedPageKey = `page.${groups.key}`;
					});
					return groups;
				})
			),
		[setState]
	);

export const Navbar: FC<object> = () => {
	const location = useLocation();
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const { breakpoints } = useContext(ScreenContext);
	const [state, setState] = useImmer<State>(initState);

	const selectedTimeKey = useSelector(timeMenuKeySelector);

	const handleMenuClick = useHandleMenuClick(navigate, dispatch);
	const setSelectedFromLocation = useSetSelectedFromLocation(setState);

	useEffect(() => {
		setSelectedFromLocation(location.pathname);
	}, [location.pathname, setSelectedFromLocation]);

	const props: NavbarProps = {
		selectedPageKey: state.selectedPageKey,
		selectedTimeKey,
		handleMenuClick
	};

	const NavbarComp = match(breakpoints)
		.with(when(isDesktop), () => <DesktopNavbar {...props} />)
		.otherwise(() => <MobileNavbar {...props} />);
	return <div data-testid="navbar">{NavbarComp}</div>;
};
