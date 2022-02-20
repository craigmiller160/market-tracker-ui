import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loadAuthUser } from '../../store/auth/actions';
import { Layout } from 'antd';
import { AppRoutes } from './AppRoutes';
import { useNotification } from '../UI/Notification/useNotification';
import { timeValueSelector } from '../../store/marketSettings/selectors';
import { isAuthorizedSelector } from '../../store/auth/selectors';
import { checkAndUpdateMarketStatus } from '../../store/marketSettings/actions';

const useCheckMarketStatus = () => {
	const isAuth = useSelector(isAuthorizedSelector);
	const dispatch = useDispatch();
	const time = useSelector(timeValueSelector);
	useEffect(() => {
		if (!isAuth) {
			return;
		}

		// TODO this will run alongside the time change one... need to figure out solution...
		dispatch(checkAndUpdateMarketStatus(time));
	}, [time, isAuth, dispatch]);
};

export const Content = () => {
	const dispatch = useDispatch();
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
