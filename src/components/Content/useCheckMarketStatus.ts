import { useImmer } from 'use-immer';
import { useSelector } from 'react-redux';
import { isAuthorizedSelector } from '../../store/auth/selectors';
import { timeValueSelector } from '../../store/marketSettings/selectors';
import { useEffect } from 'react';
import { checkAndUpdateMarketStatus } from '../../store/marketSettings/actions';
import { useStoreDispatch } from '../../store';

interface MarketStatusCheckState {
	readonly hasChecked: boolean;
}

export const useCheckMarketStatus = () => {
	const [state, setState] = useImmer<MarketStatusCheckState>({
		hasChecked: false
	});
	const isAuth = useSelector(isAuthorizedSelector);
	const dispatch = useStoreDispatch();
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
