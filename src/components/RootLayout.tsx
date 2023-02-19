import { Content } from './Content';
import { Layout } from 'antd';
import './RootLayout.scss';
import { Navbar } from './Navbar';
import { NotificationContainer } from './NotificationContainer';

export const RootLayout = () => (
	<Layout className="RootLayout">
		<Navbar />
		<Content />
		<NotificationContainer />
	</Layout>
);
