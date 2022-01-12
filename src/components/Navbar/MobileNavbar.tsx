import { Layout, Menu } from 'antd';

export const MobileNavbar = () => {
	return (
		<Layout.Sider breakpoint="lg" collapsedWidth={0}>
			<Menu theme="dark" mode="inline">
				<Menu.Item key="auth">Login</Menu.Item>
			</Menu>
		</Layout.Sider>
	);
};
