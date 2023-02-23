import { Layout } from 'antd';
import { AppRoutes } from './AppRoutes';

export const Content = () => (
	<Layout.Content className="MainContent">
		<AppRoutes />
	</Layout.Content>
);
