import './Navbar.scss';
import { Layout, Menu } from 'antd';
import { useImmer } from 'use-immer';
import { useNavbarItems } from './useNavbarItems';
import { useSelector } from 'react-redux';
import { timeMenuKeySelector } from '../../store/marketSettings/selectors';
import { useBreakpointName } from '../utils/Breakpoints';

interface State {
	readonly selectedPageKey: string;
}

const initState: State = {
	selectedPageKey: 'page.markets'
};

export const Navbar = () => {
	const [state, setState] = useImmer<State>(initState);
	const selectedTimeKey = useSelector(timeMenuKeySelector);
	const Items = useNavbarItems(state.selectedPageKey, selectedTimeKey);
	const breakpointName = useBreakpointName();
	return (
		<Layout.Header className={`Navbar ${breakpointName}`}>
			<Menu
				className="Menu"
				theme="dark"
				mode="horizontal"
				selectedKeys={[state.selectedPageKey, selectedTimeKey]}
			>
				<Menu.Item key="Nothing" className="Brand">
					Market Tracker
				</Menu.Item>
				{Items}
			</Menu>
		</Layout.Header>
	);
};
