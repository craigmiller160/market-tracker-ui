import { Menu } from 'antd';
import './DesktopNavbar.scss';
import { FC } from 'react';
import { NavbarProps } from './NavbarProps';

export const DesktopNavbar: FC<NavbarProps> = (props) => {
	const { selected, handleMenuClick } = props;
	return (
		<Menu
			onClick={handleMenuClick}
			className="DesktopNavbar"
			theme="dark"
			mode="horizontal"
			selectedKeys={[selected]}
		>
			<Menu.Item key="portfolios">Portfolios</Menu.Item>
			<Menu.Item key="watchlists">Watchlists</Menu.Item>
			<Menu.Item className="AuthItem" key="auth">
				Login
			</Menu.Item>
		</Menu>
	);
};
