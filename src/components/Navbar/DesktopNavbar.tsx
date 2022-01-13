import { Menu, Layout } from 'antd';
import './DesktopNavbar.scss';
import { FC } from 'react';
import { NavbarProps } from './NavbarProps';
import { useNavbarAuthCheck } from './useNavbarAuthStatus';

export const DesktopNavbar: FC<NavbarProps> = (props) => {
	const [isAuthorized, authBtnTxt] = useNavbarAuthCheck();
	const { selected, handleMenuClick } = props;
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
				{isAuthorized && (
					<>
						<Menu.Item key="portfolios">Portfolios</Menu.Item>
						<Menu.Item key="watchlists">Watchlists</Menu.Item>
					</>
				)}
				<Menu.Item className="AuthItem" key="auth">
					{authBtnTxt}
				</Menu.Item>
			</Menu>
		</Layout.Header>
	);
};
