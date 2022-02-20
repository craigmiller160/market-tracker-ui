import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loadAuthUser } from '../../store/auth/actions';
import { Layout } from 'antd';
import { AppRoutes } from './AppRoutes';
import { useNotification } from '../UI/Notification/useNotification';
import { timeValueSelector } from '../../store/marketSettings/selectors';
import { isAuthorizedSelector } from '../../store/auth/selectors';
import { checkAndUpdateMarketStatus } from '../../store/marketSettings/actions';
import { useImmer } from 'use-immer';

interface MarketStatusCheckState {
	readonly hasChecked: boolean;
}

// TODO need individual tests for this
// TODO move to separate file
const useCheckMarketStatus = () => {
	const [state, setState] = useImmer<MarketStatusCheckState>({
		hasChecked: false
	});
	const isAuth = useSelector(isAuthorizedSelector);
	const dispatch = useDispatch();
	const time = useSelector(timeValueSelector);
	useEffect(() => {
		if (!isAuth || state.hasChecked) {
			return;
		}

		dispatch(checkAndUpdateMarketStatus(time));
		setState((draft) => {
			draft.hasChecked = true;
		});
	}, [time, isAuth, dispatch, setState, state.hasChecked]);
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
