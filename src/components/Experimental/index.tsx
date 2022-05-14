import { Layout, Menu } from 'antd';
import './Experimental.scss';

export const ExperimentalNavbar = () => {
	return (
		<Layout.Footer className="Experimental">
			<div className="Brand">
				<h3>Market Tracker</h3>
			</div>
			<Menu className="Menu" theme="dark" mode="horizontal">
				<Menu.Item>Markets</Menu.Item>
				<Menu.Item>Today</Menu.Item>
			</Menu>
		</Layout.Footer>
	);
};
