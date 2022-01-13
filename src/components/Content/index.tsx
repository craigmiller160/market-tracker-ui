import { Welcome } from './Welcome';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loadAuthUser } from '../../store/auth/actions';
import { Layout } from 'antd';
import { hasCheckedSelector } from '../../store/auth/selectors';

export const Content = () => {
	const dispatch = useDispatch();
	const hasChecked = useSelector(hasCheckedSelector);
	useEffect(() => {
		dispatch(loadAuthUser());
	}, [dispatch]);

	return (
		<Layout.Content className="MainContent">
			{hasChecked && <Welcome />}
		</Layout.Content>
	);
};
