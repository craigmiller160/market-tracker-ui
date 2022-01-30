import { Menu } from 'antd';
import { ReactNode } from 'react';
import { match } from 'ts-pattern';
import { useNavbarAuthCheck } from './useNavbarAuthStatus';
import { identity } from 'fp-ts/es6/function';

const MainNavItems = (
	<>
		<Menu.Item key="page.markets">Markets</Menu.Item>
		<Menu.Item key="page.portfolios">Portfolios</Menu.Item>
		<Menu.Item key="page.watchlists">Watchlists</Menu.Item>
	</>
);

const TimeRangeNavItems = (
	<>
		<Menu.Item className="OneDayItem" key="time.oneDay">
			1 Day
		</Menu.Item>
		<Menu.Item key="time.oneWeek">1 Week</Menu.Item>
		<Menu.Item key="time.oneMonth">1 Month</Menu.Item>
		<Menu.Item key="time.threeMonths">3 Months</Menu.Item>
		<Menu.Item key="time.oneYear">1 Year</Menu.Item>
		<Menu.Item key="time.fiveYears">5 Years</Menu.Item>
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
