import { Welcome } from './Welcome';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loadAuthUser } from '../../store/auth/actions';
import { RootState } from '../../store';
import { Layout } from 'antd';

// TODO content disappears on smaller screen... why?
// TODO because the CSS pushes it all the way to the very bottom of the screen lol
export const Content = () => {
	const dispatch = useDispatch();
	const hasChecked = useSelector<RootState, boolean>(
		(_) => _.auth.hasChecked
	);
	useEffect(() => {
		dispatch(loadAuthUser());
	}, [dispatch]);

	return (
		<Layout.Content className="MainContent">
			{hasChecked && <Welcome />}
		</Layout.Content>
	);
};
