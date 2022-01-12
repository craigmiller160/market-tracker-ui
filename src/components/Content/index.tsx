import { Welcome } from './Welcome';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loadAuthUser } from '../../store/auth/actions';
import { RootState } from '../../store';

// TODO content disappears on smaller screen... why?
export const Content = () => {
	const dispatch = useDispatch();
	const hasChecked = useSelector<RootState, boolean>(
		(_) => _.auth.hasChecked
	);
	useEffect(() => {
		dispatch(loadAuthUser());
	}, [dispatch]);

	return <div>{hasChecked && <Welcome />}</div>;
};
