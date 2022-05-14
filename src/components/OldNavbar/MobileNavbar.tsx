import { Layout, Menu } from 'antd';
import { FC } from 'react';
import { NavbarProps } from './NavbarProps';
import './MobileNavbar.scss';
import { useNavbarItems } from './useNavbarItems';

export const MobileNavbar: FC<NavbarProps> = (props) => {
	const { selectedPageKey, selectedTimeKey, handleMenuClick } = props;

	const NavbarItems = useNavbarItems();

	return (
		<Layout.Sider
			className="MobileNavbar"
			data-testid="mobile-navbar"
			breakpoint="lg"
			collapsedWidth={0}
			width={200}
		>
			<div className="Brand">
				<h3>Market Tracker</h3>
			</div>
			<Menu
				theme="dark"
				mode="inline"
				selectedKeys={[selectedPageKey, selectedTimeKey]}
				onClick={handleMenuClick}
			>
				{NavbarItems}
			</Menu>
		</Layout.Sider>
	);
};