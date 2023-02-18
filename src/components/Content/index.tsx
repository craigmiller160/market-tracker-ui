import { Layout } from 'antd';
import { AppRoutes } from './AppRoutes';
import { useNotification } from '../UI/Notification/useNotification';
import { useCheckMarketStatus } from './useCheckMarketStatus';

export const Content = () => {
	useNotification();
	useCheckMarketStatus();

	return (
		<Layout.Content className="MainContent">
			<AppRoutes />
		</Layout.Content>
	);
};
