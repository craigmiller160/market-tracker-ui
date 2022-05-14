import { ReactNode } from 'react';
import { useNavbarAuthCheck } from './useNavbarAuthStatus';
import { MarketTime, marketTimeToMenuKey } from '../../types/MarketTime';
import { identity } from 'fp-ts/es6/function';
import { Menu } from 'antd';

interface NavbarItem {
	readonly key: string;
	readonly name: string;
}

interface AllItems {
	readonly pages: ReadonlyArray<NavbarItem>;
	readonly times: ReadonlyArray<NavbarItem>;
}

const ITEMS: AllItems = {
	pages: [
		{
			key: 'page.markets',
			name: 'Markets'
		},
		{
			key: 'page.search',
			name: 'Search'
		},
		{
			key: 'page.watchlists',
			name: 'Watchlists'
		},
		{
			key: 'page.recognition',
			name: 'Recognition'
		}
	],
	times: [
		{
			key: marketTimeToMenuKey(MarketTime.ONE_DAY),
			name: 'Today'
		},
		{
			key: marketTimeToMenuKey(MarketTime.ONE_WEEK),
			name: '1 Week'
		},
		{
			key: marketTimeToMenuKey(MarketTime.ONE_MONTH),
			name: '1 Month'
		},
		{
			key: marketTimeToMenuKey(MarketTime.THREE_MONTHS),
			name: '3 Months'
		},
		{
			key: marketTimeToMenuKey(MarketTime.ONE_YEAR),
			name: '1 Year'
		},
		{
			key: marketTimeToMenuKey(MarketTime.FIVE_YEARS),
			name: '5 Years'
		}
	]
};

const createAuthNavItem = (
	isAuthorized: boolean,
	authBtnAction: () => void,
	authBtnTxt: string
) => {
	const className = ['AuthItem', isAuthorized ? 'IsAuth' : null]
		.filter(identity)
		.join(' ');
	return (
		<Menu.Item
			className={className}
			key="auth.action"
			onClick={authBtnAction}
		>
			{authBtnTxt}
		</Menu.Item>
	);
};

// TODO need to know which items are selected
export const useNavbarItems = (): ReactNode => {
	const [isAuthorized, hasChecked, authBtnTxt, authBtnAction] =
		useNavbarAuthCheck();

	const AuthNavItem = createAuthNavItem(
		isAuthorized,
		authBtnAction,
		authBtnTxt
	);

	return <div />;
};
