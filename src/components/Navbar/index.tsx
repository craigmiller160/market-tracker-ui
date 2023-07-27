import './Navbar.scss';
import { Layout, Menu, MenuProps } from 'antd';
import { Updater, useImmer } from 'use-immer';
import { useNavbarItems } from './useNavbarItems';
import { useDispatch, useSelector } from 'react-redux';
import { timeMenuKeySelector } from '../../store/marketSettings/selectors';
import { BreakpointName, useBreakpointName } from '../utils/Breakpoints';
import { NavigateFunction, useLocation, useNavigate } from 'react-router';
import { useCallback, useEffect } from 'react';
import { StoreDispatch } from '../../store';
import { pipe } from 'fp-ts/function';
import * as Option from 'fp-ts/Option';
import { match, P } from 'ts-pattern';
import { changeSelectedTime } from '../../store/marketSettings/actions';
import * as Regex from '@craigmiller160/ts-functions/Regex';
import { MenuInfo } from 'rc-menu/lib/interface';

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
			if (menuItemInfo.key === 'nothing') {
				return;
			}
			const keyParts = pipe(
				captureMenuKeyParts(menuItemInfo.key),
				Option.getOrElse(() => ({
					prefix: '',
					action: ''
				}))
			);

			match(keyParts)
				.with({ prefix: 'auth' }, () => {
					// Do nothing
				})
				.with({ prefix: 'page', action: P.select() }, (page) => {
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

export const Navbar = () => {
	const location = useLocation();
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const [state, setState] = useImmer<State>(initState);
	const selectedTimeKey = useSelector(timeMenuKeySelector);
	const items = useNavbarItems(state.selectedPageKey, selectedTimeKey);
	const breakpointName = useBreakpointName();

	const handleMenuClick = useHandleMenuClick(navigate, dispatch);
	const setSelectedFromLocation = useSetSelectedFromLocation(setState);

	useEffect(() => {
		setSelectedFromLocation(location.pathname);
	}, [location.pathname, setSelectedFromLocation]);

	const testId = match(breakpointName)
		.with(BreakpointName.XS, () => 'mobile-navbar')
		.otherwise(() => 'desktop-navbar');
	const selectedKeys = match(breakpointName)
		.with(BreakpointName.XS, () => [])
		.otherwise(() => [state.selectedPageKey, selectedTimeKey]);

	const itemsPlusBrand: MenuProps['items'] = [
		{
			key: 'nothing',
			className: 'Brand',
			label: 'Market Tracker'
		},
		...(items ?? [])
	];

	return (
		<Layout.Header
			className={`Navbar ${breakpointName}`}
			data-testid="navbar"
		>
			<Menu
				onClick={handleMenuClick}
				className="Menu"
				theme="dark"
				mode="horizontal"
				data-testid={testId}
				selectedKeys={selectedKeys}
				items={itemsPlusBrand}
			/>
		</Layout.Header>
	);
};
