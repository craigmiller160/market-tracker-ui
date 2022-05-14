import './Navbar.scss';
import { Layout, Menu } from 'antd';
import { useImmer } from 'use-immer';
import { useNavbarItems } from './useNavbarItems';

interface State {
	readonly selectedPageKey: string;
}

const initState: State = {
	selectedPageKey: 'page.markets'
};

export const Navbar = () => {
	const [state, setState] = useImmer<State>(initState);
	const Items = useNavbarItems();
	return (
		<Layout.Header className="Navbar">
			<Menu className="Menu" theme="dark" mode="horizontal">
				<Menu.Item key="Nothing" className="Brand">
					Market Tracker
				</Menu.Item>
				{Items}
			</Menu>
		</Layout.Header>
	);
};
