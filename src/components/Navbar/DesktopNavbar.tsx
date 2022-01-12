import { Menu } from 'antd';
import './DesktopNavbar.scss';
import { FC } from 'react';
import { NavbarProps } from './NavbarProps';

export const DesktopNavbar: FC<NavbarProps> = () => {
	return (
		<Menu className="DesktopNavbar" theme="dark" mode="horizontal">
			<Menu.Item className="AuthItem" key="auth">
				Login
			</Menu.Item>
		</Menu>
	);
};
