import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { loadAuthUser } from '../../store/auth/actions';
import { Layout } from 'antd';
import { AppRoutes } from './AppRoutes';
import { useNotification } from '../UI/Notification/useNotification';
import { useCheckMarketStatus } from './useCheckMarketStatus';
import { Breadcrumb } from '../UI/Breadcrumb';

export const Content = () => {
	const dispatch = useDispatch();
	useNotification();
	useCheckMarketStatus();

	useEffect(() => {
		dispatch(loadAuthUser());
	}, [dispatch]);

	return (
		<Layout.Content className="MainContent">
			<Breadcrumb />
			<AppRoutes />
		</Layout.Content>
	);
};
