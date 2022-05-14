import { Layout, Menu } from 'antd';
import './Experimental.scss';

export const ExperimentalNavbar = () => {
	return (
		<Layout.Header className="Experimental">
			{/*<div className="Brand">*/}
			{/*	<h3>Market Tracker</h3>*/}
			{/*</div>*/}
			<Menu className="Menu" theme="dark" mode="horizontal">
				<Menu.Item>Market Tracker</Menu.Item>
				<Menu.Item>Markets</Menu.Item>
				<Menu.Item>Today</Menu.Item>
				<Menu.Item>Logout</Menu.Item>
			</Menu>
		</Layout.Header>
	);
};
