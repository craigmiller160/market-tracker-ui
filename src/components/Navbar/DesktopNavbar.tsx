import { Layout, Menu } from 'antd';
import './DesktopNavbar.scss';
import { FC } from 'react';
import { NavbarProps } from './NavbarProps';
import { useNavbarItems } from './useNavbarItems';

export const DesktopNavbar: FC<NavbarProps> = (props) => {
	const {
		selected,
		handleMenuClick,
		isAuthorized,
		hasChecked,
		authBtnTxt,
		authBtnAction
	} = props;

	const NavbarItems = useNavbarItems({
		isAuthorized,
		hasChecked,
		authBtnTxt,
		authBtnAction
	});

	return (
		<Layout.Header className="DesktopNavbar" data-testid="desktop-navbar">
			<div className="Brand">
				<h3>Market Tracker</h3>
			</div>
			<Menu
				onClick={handleMenuClick}
				theme="dark"
				mode="horizontal"
				selectedKeys={[selected]}
			>
				{NavbarItems}
			</Menu>
		</Layout.Header>
	);
};
