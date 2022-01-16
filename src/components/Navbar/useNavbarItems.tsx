import { Menu } from 'antd';
import { ReactNode } from 'react';
import { match } from 'ts-pattern';

const MainNavItems = (
	<>
		<Menu.Item key="portfolios">Portfolios</Menu.Item>
		<Menu.Item key="watchlists">Watchlists</Menu.Item>
	</>
);

const createAuthNavItem = (authBtnAction: () => void, authBtnTxt: string) => (
	<Menu.Item className="AuthItem" key="auth" onClick={authBtnAction}>
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
				{AuthNavItem}
			</>
		))
		.with({ isAuthorized: false, hasChecked: true }, () => (
			<>{AuthNavItem}</>
		))
		.otherwise(() => <></>);
};
