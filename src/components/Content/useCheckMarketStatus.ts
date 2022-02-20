import { useImmer } from 'use-immer';
import { useDispatch, useSelector } from 'react-redux';
import { isAuthorizedSelector } from '../../store/auth/selectors';
import { timeValueSelector } from '../../store/marketSettings/selectors';
import { useEffect } from 'react';
import { checkAndUpdateMarketStatus } from '../../store/marketSettings/actions';

interface MarketStatusCheckState {
	readonly hasChecked: boolean;
}

// TODO need individual tests for this
export const useCheckMarketStatus = () => {
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
