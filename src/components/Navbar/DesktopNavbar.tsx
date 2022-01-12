import { Menu } from 'antd';
import './DesktopNavbar.scss';

export const DesktopNavbar = () => {
	return (
		<Menu className="DesktopNavbar" theme="dark" mode="horizontal">
			<Menu.Item className="AuthItem" key="auth">
				Login
			</Menu.Item>
		</Menu>
	);
};
