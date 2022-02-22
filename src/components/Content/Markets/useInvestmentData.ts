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
import { TimerContext } from './TimerContext';

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
	const { timestamp } = useContext(TimerContext);
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
		shouldLoadData,
		timestamp
	]);

	return state;
};
