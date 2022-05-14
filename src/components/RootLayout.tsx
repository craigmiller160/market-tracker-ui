import { Content } from './Content';
import { Layout } from 'antd';
import './RootLayout.scss';
import { Navbar } from './Navbar';

export const RootLayout = () => (
	<Layout className="RootLayout">
		<Navbar />
		<Content />
	</Layout>
);
