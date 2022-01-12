import { Layout, Menu } from 'antd';
import { FC } from 'react';
import { NavbarProps } from './NavbarProps';

export const MobileNavbar: FC<NavbarProps> = () => {
	return (
		<Layout.Sider breakpoint="lg" collapsedWidth={0}>
			<Menu theme="dark" mode="inline">
				<Menu.Item key="auth">Login</Menu.Item>
			</Menu>
		</Layout.Sider>
	);
};
