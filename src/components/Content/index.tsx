import { Layout } from 'antd';
import { AppRoutes } from './AppRoutes';
import { useCheckMarketStatus } from './useCheckMarketStatus';

export const Content = () => {
	useCheckMarketStatus();

	return (
		<Layout.Content className="MainContent">
			<AppRoutes />
		</Layout.Content>
	);
};
