import { Layout, Menu } from 'antd';
import './DesktopNavbar.scss';
import { FC } from 'react';
import { NavbarProps } from './NavbarProps';
import { useNavbarItems } from './useNavbarItems';

export const DesktopNavbar: FC<NavbarProps> = (props) => {
	const { selectedPageKey, selectedTimeKey, handleMenuClick } = props;
	const NavbarItems = useNavbarItems();

	return (
		<Layout.Header className="DesktopNavbar" data-testid="desktop-navbar">
			<div className="Brand">
				<h3>Market Tracker</h3>
			</div>
			<Menu
				onClick={handleMenuClick}
				theme="dark"
				mode="horizontal"
				selectedKeys={[selectedPageKey, selectedTimeKey]}
			>
				{NavbarItems}
			</Menu>
		</Layout.Header>
	);
};
