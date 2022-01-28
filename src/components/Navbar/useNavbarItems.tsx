import { Menu } from 'antd';
import { ReactNode } from 'react';
import { match } from 'ts-pattern';

const MainNavItems = (
	<>
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

const createAuthNavItem = (authBtnAction: () => void, authBtnTxt: string) => (
	<Menu.Item className="AuthItem" key="auth.action" onClick={authBtnAction}>
		{authBtnTxt}
	</Menu.Item>
);

interface NavbarItemConfig {
	readonly isAuthorized: boolean;
	readonly hasChecked: boolean;
	readonly authBtnAction: () => void;
	readonly authBtnTxt: string;
}

export const useNavbarItems = (config: NavbarItemConfig): ReactNode => {
	const { isAuthorized, hasChecked, authBtnAction, authBtnTxt } = config;

	const AuthNavItem = createAuthNavItem(authBtnAction, authBtnTxt);

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
