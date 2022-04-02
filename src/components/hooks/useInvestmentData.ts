import { MarketTime } from '../../types/MarketTime';
import { useDispatch } from 'react-redux';
import { Updater, useImmer } from 'use-immer';
import { useContext, useEffect, useMemo } from 'react';
import {
	getInvestmentData,
	InvestmentData
} from '../../services/MarketInvestmentService';
import { pipe } from 'fp-ts/es6/function';
import * as TaskEither from 'fp-ts/es6/TaskEither';
import { Dispatch } from 'redux';
import { TaskT } from '@craigmiller160/ts-functions/es/types';
import { notificationSlice } from '../../store/notification/slice';
import { castDraft } from 'immer';
import { RefreshTimerContext } from '../Content/common/refresh/RefreshTimerContext';
import { isNestedAxiosError } from '../../services/AjaxApi';
import { InvestmentInfo } from '../../types/data/InvestmentInfo';
import { match, when } from 'ts-pattern';
import {
	getInvestmentNotFoundMessage,
	isNestedInvestmentNotFoundError
} from '../../error/InvestmentNotFoundError';

export interface ErrorInfo {
	readonly name: string;
	readonly message: string;
	readonly isAxios: boolean;
}

export interface InvestmentDataState {
	readonly loading: boolean;
	readonly timeAtLastLoading?: MarketTime;
	readonly data: InvestmentData;
	readonly error: ErrorInfo | undefined;
}

const createHandleGetDataError =
	(dispatch: Dispatch, setState: Updater<InvestmentDataState>) =>
	(ex: Error): TaskT<void> =>
	async () => {
		const errorInfo = match(ex)
			.with(
				when(isNestedAxiosError),
				(): ErrorInfo => ({
					name: '',
					message: '',
					isAxios: true
				})
			)
			.with(when(isNestedInvestmentNotFoundError), () => {
				console.error('Error getting data', ex);
				return {
					name: 'InvestmentNotFoundError',
					message: getInvestmentNotFoundMessage(ex),
					isAxios: false
				};
			})
			.otherwise((): ErrorInfo => {
				console.error('Error getting data', ex);
				dispatch(
					notificationSlice.actions.addError(
						`Error getting data: ${ex.message}`
					)
				);
				return {
					name: ex.name,
					message: ex.message,
					isAxios: false
				};
			});

		setState((draft) => {
			draft.loading = false;
			draft.error = errorInfo;
			draft.data = {
				startPrice: 0,
				name: '',
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
			draft.error = undefined;
			draft.data = castDraft(data);
		});
	};

export const useInvestmentData = (
	time: MarketTime,
	info: InvestmentInfo,
	shouldLoadHistoryData: boolean
): InvestmentDataState => {
	const { refreshTimestamp } = useContext(RefreshTimerContext);
	const dispatch = useDispatch();
	const [state, setState] = useImmer<InvestmentDataState>({
		loading: false,
		data: {
			startPrice: 0,
			name: '',
			currentPrice: 0,
			history: []
		},
		error: undefined
	});

	const handleGetDataError = useMemo(
		() => createHandleGetDataError(dispatch, setState),
		[dispatch, setState]
	);
	const handleGetDataSuccess = useMemo(
		() => createHandleGetDataSuccess(setState),
		[setState]
	);

	// TODO refresh still triggers quotes, need to prevent that somehow. Probably at the refresh provider level

	useEffect(() => {
		setState((draft) => {
			if (draft.timeAtLastLoading !== time) {
				draft.timeAtLastLoading = time;
			} else {
				draft.data = {
					startPrice: 0,
					name: '',
					currentPrice: 0,
					history: []
				};
			}
			draft.loading = true;
			draft.error = undefined;
		});
	}, [setState, shouldLoadHistoryData, time, info.symbol]);

	useEffect(() => {
		pipe(
			getInvestmentData(time, info, shouldLoadHistoryData),
			TaskEither.fold(handleGetDataError, handleGetDataSuccess)
		)();
	}, [
		time,
		info,
		handleGetDataError,
		handleGetDataSuccess,
		shouldLoadHistoryData,
		refreshTimestamp
	]);

	return state;
};
