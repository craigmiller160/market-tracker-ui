import { Layout, Menu } from 'antd';
import { FC } from 'react';
import { NavbarProps } from './NavbarProps';
import './MobileNavbar.scss';

export const MobileNavbar: FC<NavbarProps> = (props) => {
	const {
		selected,
		handleMenuClick,
		isAuthorized,
		authBtnTxt,
		authBtnAction
	} = props;
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
				{isAuthorized && (
					<>
						<Menu.Item key="portfolios">Portfolios</Menu.Item>
						<Menu.Item key="watchlists">Watchlists</Menu.Item>
					</>
				)}
				<Menu.Item key="auth" onClick={authBtnAction}>
					{authBtnTxt}
				</Menu.Item>
			</Menu>
		</Layout.Sider>
	);
};
