import { MarketTime } from '../../../types/MarketTime';
import { MarketInvestmentInfo } from '../../../types/data/MarketInvestmentInfo';
import { useDispatch } from 'react-redux';
import { Updater, useImmer } from 'use-immer';
import { useCallback, useEffect } from 'react';
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

export interface InvestmentDataState {
	readonly loading: boolean;
	readonly data: InvestmentData;
	readonly hasError: boolean;
}

const createHandleGetDataError =
	(dispatch: Dispatch, setState: Updater<InvestmentDataState>) =>
	(ex: Error): TaskT<void> =>
	async () => {
		dispatch(
			notificationSlice.actions.addError(
				`Error getting data: ${ex.message}`
			)
		);
		setState((draft) => {
			draft.loading = false;
			draft.hasError = true;
			draft.data = {
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
	const dispatch = useDispatch();
	const [state, setState] = useImmer<InvestmentDataState>({
		loading: false,
		data: {
			currentPrice: 0,
			history: []
		},
		hasError: false
	});

	// eslint-disable-next-line react-hooks/exhaustive-deps
	const handleGetDataError = useCallback(
		createHandleGetDataError(dispatch, setState),
		[dispatch, setState]
	);
	// eslint-disable-next-line react-hooks/exhaustive-deps
	const handleGetDataSuccess = useCallback(
		createHandleGetDataSuccess(setState),
		[setState]
	);

	useEffect(() => {
		if (!shouldLoadData) {
			return;
		}

		setState((draft) => {
			draft.loading = true;
		});

		pipe(
			getInvestmentData(time, info),
			TaskEither.fold(handleGetDataError, handleGetDataSuccess)
		)();
	}, [
		time,
		info,
		setState,
		handleGetDataError,
		handleGetDataSuccess,
		shouldLoadData
	]);

	return state;
};
