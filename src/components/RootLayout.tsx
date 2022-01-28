import { Navbar } from './Navbar';
import { Content } from './Content';
import { Layout } from 'antd';

export const RootLayout = () => (
	<>
		<Layout>
			<Navbar />
			<Content />
		</Layout>
	</>
);
