import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { loadAuthUser } from '../../store/auth/actions';
import { Layout } from 'antd';
import { AppRoutes } from './AppRoutes';
import { Alert } from '../UI/Alert';
import { Temp } from '../UI/Temp';

export const Content = () => {
	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(loadAuthUser());
	}, [dispatch]);

	return (
		<Layout.Content className="MainContent">
			<Alert />
			<Temp />
			<AppRoutes />
		</Layout.Content>
	);
};
