import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loadAuthUser } from '../../store/auth/actions';
import { Layout } from 'antd';
import {
	hasCheckedSelector,
	isAuthorizedSelector
} from '../../store/auth/selectors';
import { AppRoutes } from '../AppRoutes';

export const Content = () => {
	const dispatch = useDispatch();
	const hasChecked = useSelector(hasCheckedSelector);
	const isAuthorized = useSelector(isAuthorizedSelector);

	useEffect(() => {
		dispatch(loadAuthUser());
	}, [dispatch]);

	return (
		<Layout.Content className="MainContent">
			<AppRoutes />
		</Layout.Content>
	);
};
