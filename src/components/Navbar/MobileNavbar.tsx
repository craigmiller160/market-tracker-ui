import { Layout, Menu } from 'antd';
import { FC } from 'react';
import { NavbarProps } from './NavbarProps';
import './MobileNavbar.scss';
import { useNavbarItems } from './useNavbarItems';

export const MobileNavbar: FC<NavbarProps> = (props) => {
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
		<Layout.Sider
			className="MobileNavbar"
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
				selectedKeys={[selected]}
				onClick={handleMenuClick}
			>
				{NavbarItems}
			</Menu>
		</Layout.Sider>
	);
};
