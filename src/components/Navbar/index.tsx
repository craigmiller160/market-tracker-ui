import './Navbar.scss';
import { Layout, Menu } from 'antd';
import { useImmer } from 'use-immer';

interface State {
	readonly selectedPageKey: string;
}

const initState: State = {
	selectedPageKey: 'page.markets'
};

export const Navbar = () => {
	const [state, setState] = useImmer<State>(initState);
	return (
		<Layout.Header className="Navbar">
			<Menu className="Menu" theme="dark" mode="horizontal">
				<Menu.Item key="Nothing" className="Brand">Market Tracker</Menu.Item>
			</Menu>
		</Layout.Header>
	)
};
