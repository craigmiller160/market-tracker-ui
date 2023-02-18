import { useEffect } from 'react';
import { loadAuthUser } from '../../store/auth/actions';
import { Layout } from 'antd';
import { AppRoutes } from './AppRoutes';
import { useNotification } from '../UI/Notification/useNotification';
import { useCheckMarketStatus } from './useCheckMarketStatus';
import { useStoreDispatch } from '../../store';

export const Content = () => {
	const dispatch = useStoreDispatch();
	useNotification();
	useCheckMarketStatus();

	useEffect(() => {
		dispatch(loadAuthUser());
	}, [dispatch]);

	return (
		<Layout.Content className="MainContent">
			<AppRoutes />
		</Layout.Content>
	);
};
