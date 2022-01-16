import { Layout, Menu } from 'antd';
import './DesktopNavbar.scss';
import { FC } from 'react';
import { NavbarProps } from './NavbarProps';
import { match } from 'ts-pattern';

const MainNavItems = () => (
	<>
		<Menu.Item key="portfolios">Portfolios</Menu.Item>
		<Menu.Item key="watchlists">Watchlists</Menu.Item>
	</>
);

const AuthNavItem = ({
	authBtnAction,
	authBtnTxt
}: {
	authBtnAction: () => void;
	authBtnTxt: string;
}) => (
	<Menu.Item className="AuthItem" key="auth" onClick={authBtnAction}>
		{authBtnTxt}
	</Menu.Item>
);

export const DesktopNavbar: FC<NavbarProps> = (props) => {
	const {
		selected,
		handleMenuClick,
		isAuthorized,
		hasChecked,
		authBtnTxt,
		authBtnAction
	} = props;
	return (
		<Layout.Header className="DesktopNavbar">
			<div className="Brand">
				<h3>Market Tracker</h3>
			</div>
			<Menu
				onClick={handleMenuClick}
				theme="dark"
				mode="horizontal"
				selectedKeys={[selected]}
			>
				{match({ isAuthorized, hasChecked })
					.with({ isAuthorized: true, hasChecked: true }, () => (
						<>
							<MainNavItems />
							<AuthNavItem
								authBtnAction={authBtnAction}
								authBtnTxt={authBtnTxt}
							/>
						</>
					))
					.with({ isAuthorized: false, hasChecked: true }, () => (
						<AuthNavItem
							authBtnAction={authBtnAction}
							authBtnTxt={authBtnTxt}
						/>
					))
					.otherwise(() => (
						<span />
					))}
			</Menu>
		</Layout.Header>
	);
};
