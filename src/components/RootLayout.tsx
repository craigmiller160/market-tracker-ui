import { Navbar } from './Navbar';
import { Content } from './Content';
import { Layout } from 'antd';
import './RootLayout.scss';

export const RootLayout = () => (
	<Layout className="RootLayout">
		<Navbar />
		<Content />
	</Layout>
);
