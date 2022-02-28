import { MarketTime } from '../../../types/MarketTime';
import { MarketInvestmentInfo } from '../../../types/data/MarketInvestmentInfo';
import { useDispatch } from 'react-redux';
import { Updater, useImmer } from 'use-immer';
import { useContext, useEffect, useMemo } from 'react';
import {
	getInvestmentData,
	InvestmentData
} from '../../../services/MarketInvestmentService';
import { pipe } from 'fp-ts/es6/function';
import * as TaskEither from 'fp-ts/es6/TaskEither';
import { Dispatch } from 'redux';
import { TaskT } from '@craigmiller160/ts-functions/es/types';
import { notificationSlice } from '../../../store/notification/slice';
import { castDraft } from 'immer';
import { RefreshTimerContext } from './RefreshTimerContext';
import { isAxiosError } from '@craigmiller160/ajax-api-fp-ts';

export interface InvestmentDataState {
	readonly loading: boolean;
	readonly timeAtLastLoading?: MarketTime;
	readonly data: InvestmentData;
	readonly hasError: boolean;
}

const createHandleGetDataError =
	(dispatch: Dispatch, setState: Updater<InvestmentDataState>) =>
	(ex: Error): TaskT<void> =>
	async () => {
		if (!isAxiosError(ex)) {
			console.error('Error getting data', ex);
			dispatch(
				notificationSlice.actions.addError(
					`Error getting data: ${ex.message}`
				)
			);
		}
		setState((draft) => {
			draft.loading = false;
			draft.hasError = true;
			draft.data = {
				startPrice: 0,
				currentPrice: 0,
				history: []
			};
		});
	};

const createHandleGetDataSuccess =
	(setState: Updater<InvestmentDataState>) =>
	(data: InvestmentData): TaskT<void> =>
	async () => {
		setState((draft) => {
			draft.loading = false;
			draft.hasError = false;
			draft.data = castDraft(data);
		});
	};

export const useInvestmentData = (
	time: MarketTime,
	info: MarketInvestmentInfo,
	shouldLoadData: boolean
): InvestmentDataState => {
	const { refreshTimestamp } = useContext(RefreshTimerContext);
	const dispatch = useDispatch();
	const [state, setState] = useImmer<InvestmentDataState>({
		loading: false,
		data: {
			startPrice: 0,
			currentPrice: 0,
			history: []
		},
		hasError: false
	});

	const handleGetDataError = useMemo(
		() => createHandleGetDataError(dispatch, setState),
		[dispatch, setState]
	);
	const handleGetDataSuccess = useMemo(
		() => createHandleGetDataSuccess(setState),
		[setState]
	);

	useEffect(() => {
		if (!shouldLoadData) {
			return;
		}

		setState((draft) => {
			if (draft.timeAtLastLoading !== time) {
				draft.loading = true;
				draft.timeAtLastLoading = time;
			}
		});
	}, [setState, shouldLoadData, time]);

	useEffect(() => {
		if (!shouldLoadData) {
			return;
		}

		pipe(
			getInvestmentData(time, info),
			TaskEither.fold(handleGetDataError, handleGetDataSuccess)
		)();
	}, [
		time,
		info,
		handleGetDataError,
		handleGetDataSuccess,
		shouldLoadData,
		refreshTimestamp
	]);

	return state;
};
