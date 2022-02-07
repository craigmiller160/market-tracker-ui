import { Menu } from 'antd';
import { ReactNode } from 'react';
import { match } from 'ts-pattern';
import { useNavbarAuthCheck } from './useNavbarAuthStatus';
import { identity } from 'fp-ts/es6/function';
import { MarketTime, marketTimeToMenuKey } from '../../types/MarketTime';

const createMainNavItems = () => {
	const AlwaysShowItems = <Menu.Item key="page.markets">Markets</Menu.Item>;
	const NonProdItems = match(process.env.NODE_ENV)
		.with('production', () => <></>)
		.otherwise(() => (
			<>
				<Menu.Item key="page.portfolios">Portfolios</Menu.Item>
				<Menu.Item key="page.watchlists">Watchlists</Menu.Item>
			</>
		));

	return (
		<>
			{AlwaysShowItems}
			{NonProdItems}
		</>
	);
};

const TimeRangeNavItems = (
	<>
		<Menu.Item
			className="OneDayItem"
			key={marketTimeToMenuKey(MarketTime.ONE_DAY)}
		>
			Today
		</Menu.Item>
		<Menu.Item key={marketTimeToMenuKey(MarketTime.ONE_WEEK)}>
			1 Week
		</Menu.Item>
		<Menu.Item key={marketTimeToMenuKey(MarketTime.ONE_MONTH)}>
			1 Month
		</Menu.Item>
		<Menu.Item key={marketTimeToMenuKey(MarketTime.THREE_MONTHS)}>
			3 Months
		</Menu.Item>
		<Menu.Item key={marketTimeToMenuKey(MarketTime.ONE_YEAR)}>
			1 Year
		</Menu.Item>
		<Menu.Item key={marketTimeToMenuKey(MarketTime.FIVE_YEARS)}>
			5 Years
		</Menu.Item>
	</>
);

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

export const useNavbarItems = (): ReactNode => {
	const [isAuthorized, hasChecked, authBtnTxt, authBtnAction] =
		useNavbarAuthCheck();

	const AuthNavItem = createAuthNavItem(
		isAuthorized,
		authBtnAction,
		authBtnTxt
	);
	const MainNavItems = createMainNavItems();

	return match({ isAuthorized, hasChecked })
		.with({ isAuthorized: true, hasChecked: true }, () => (
			<>
				{MainNavItems}
				{TimeRangeNavItems}
				{AuthNavItem}
			</>
		))
		.with({ isAuthorized: false, hasChecked: true }, () => (
			<>{AuthNavItem}</>
		))
		.otherwise(() => <></>);
};
