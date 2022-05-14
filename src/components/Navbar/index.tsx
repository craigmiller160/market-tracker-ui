import './Navbar.scss';
import { Layout, Menu } from 'antd';

interface State {
	readonly selectedPageKey: string;
}

const initState: State = {
	selectedPageKey: 'page.markets'
};

export const Navbar = () => {
	return (
		<Layout.Header className="Navbar">
			<Menu className="Menu" theme="dark" mode="horizontal">
				<Menu.Item className="Brand">Market Tracker</Menu.Item>
			</Menu>
		</Layout.Header>
	)
};
