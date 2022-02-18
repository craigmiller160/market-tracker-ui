import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loadAuthUser } from '../../store/auth/actions';
import { Layout } from 'antd';
import { AppRoutes } from './AppRoutes';
import { useNotification } from '../UI/Notification/useNotification';
import { timeValueSelector } from '../../store/time/selectors';
import { checkMarketStatus } from '../../services/MarketInvestmentService';
import { MarketStatus } from '../../types/MarketStatus';
import { useImmer } from 'use-immer';
import {
	MarketStatusContext,
	MarketStatusContextValue
} from './MarketStatusContext';
import { pipe } from 'fp-ts/es6/function';
import * as TaskEither from 'fp-ts/es6/TaskEither';
import * as Task from 'fp-ts/es6/Task';
import { isAuthorizedSelector } from '../../store/auth/selectors';

interface MarketStatusState {
	readonly marketStatus: MarketStatus;
}

const useCheckMarketStatus = (): MarketStatus => {
	const isAuth = useSelector(isAuthorizedSelector);
	const [state, setState] = useImmer<MarketStatusState>({
		marketStatus: MarketStatus.UNKNOWN
	});
	const time = useSelector(timeValueSelector);
	useEffect(() => {
		if (!isAuth) {
			return;
		}

		setState((draft) => {
			draft.marketStatus = MarketStatus.UNKNOWN;
		});
		pipe(
			checkMarketStatus(time),
			TaskEither.fold(
				() => async () => MarketStatus.UNKNOWN,
				(status) => async () => status
			),
			Task.map((status) =>
				setState((draft) => {
					draft.marketStatus = status;
				})
			)
		)();
	}, [time, setState, isAuth]);

	return state.marketStatus;
};

export const Content = () => {
	const dispatch = useDispatch();
	useNotification();
	const marketStatus = useCheckMarketStatus();

	useEffect(() => {
		dispatch(loadAuthUser());
	}, [dispatch]);

	const marketStatusContextValue: MarketStatusContextValue = {
		status: marketStatus
	};

	return (
		<MarketStatusContext.Provider value={marketStatusContextValue}>
			<Layout.Content className="MainContent">
				<AppRoutes />
			</Layout.Content>
		</MarketStatusContext.Provider>
	);
};
