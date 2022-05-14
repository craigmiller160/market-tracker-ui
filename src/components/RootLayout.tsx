import { Content } from './Content';
import { Layout } from 'antd';
import './RootLayout.scss';
import { ExperimentalNavbar } from './Experimental';

export const RootLayout = () => (
	<Layout className="RootLayout">
		<ExperimentalNavbar />
		<Content />
	</Layout>
);
