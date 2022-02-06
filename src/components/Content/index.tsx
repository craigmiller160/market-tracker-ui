import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { loadAuthUser } from '../../store/auth/actions';
import { Layout } from 'antd';
import { AppRoutes } from './AppRoutes';
import { Alert } from '../UI/Alert';
import { useNotification } from '../UI/Notification/useNotification';

export const Content = () => {
	const dispatch = useDispatch();
	useNotification();

	useEffect(() => {
		dispatch(loadAuthUser());
	}, [dispatch]);

	return (
		<Layout.Content className="MainContent">
			<Alert />
			<AppRoutes />
		</Layout.Content>
	);
};
