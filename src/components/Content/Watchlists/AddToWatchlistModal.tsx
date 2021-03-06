import {
	Form,
	FormInstance,
	Input,
	Modal,
	Radio,
	Select,
	Space,
	Typography
} from 'antd';
import { Updater, useImmer } from 'use-immer';
import { constVoid, pipe } from 'fp-ts/es6/function';
import * as TaskEither from 'fp-ts/es6/TaskEither';
import {
	addStockToWatchlist,
	createWatchlist,
	getWatchlistNames
} from '../../../services/WatchlistService';
import { useEffect, useMemo } from 'react';
import { castDraft } from 'immer';
import { TaskT, TaskTryT } from '@craigmiller160/ts-functions/es/types';
import { match } from 'ts-pattern';
import { Spinner } from '../../UI/Spinner';
import './AddToWatchlistModal.scss';
import { DbWatchlist } from '../../../types/Watchlist';
import { useDispatch } from 'react-redux';
import { Dispatch } from 'redux';
import * as Task from 'fp-ts/es6/Task';
import { notificationSlice } from '../../../store/notification/slice';
import { useForceUpdate } from '../../hooks/useForceUpdate';

interface Props {
	readonly show: boolean;
	readonly symbol: string;
	readonly onClose: () => void;
}

type WatchlistSelectionType = 'existing' | 'new';

interface ModalFormData {
	readonly watchlistSelectionType: WatchlistSelectionType;
	readonly newWatchListName: string;
	readonly existingWatchlistName: string;
}

interface State {
	readonly loading: boolean;
	readonly hadError: boolean;
	readonly existingWatchlistNames: ReadonlyArray<string>;
}

const createGetWatchlistNames = (setState: Updater<State>): TaskT<void> => {
	setState((draft) => {
		draft.loading = true;
		draft.existingWatchlistNames = [];
		draft.hadError = false;
	});
	return pipe(
		getWatchlistNames(),
		TaskEither.fold(
			() => async () =>
				setState((draft) => {
					draft.loading = false;
					draft.hadError = true;
				}),
			(names) => async () =>
				setState((draft) => {
					draft.loading = false;
					draft.existingWatchlistNames = castDraft(names);
				})
		)
	);
};

interface ModalFormProps {
	readonly form: FormInstance<ModalFormData>;
	readonly existingWatchlistNames: ReadonlyArray<string>;
	readonly onFormChange: () => void;
}

const ModalForm = (props: ModalFormProps) => {
	const isNewWatchlist =
		props.form.getFieldsValue().watchlistSelectionType === 'new';
	const newWatchlistStyle = isNewWatchlist ? undefined : { display: 'none' };
	const existingWatchlistStyle = isNewWatchlist
		? { display: 'none' }
		: undefined;

	return (
		<Form
			form={props.form}
			preserve
			onValuesChange={props.onFormChange}
			initialValues={{
				watchlistSelectionType: 'existing'
			}}
		>
			<Form.Item name="watchlistSelectionType">
				<Radio.Group>
					<Space direction="vertical">
						<Radio value="existing">Existing Watchlist</Radio>
						<Radio value="new">New Watchlist</Radio>
					</Space>
				</Radio.Group>
			</Form.Item>
			<Form.Item name="newWatchListName" style={newWatchlistStyle}>
				<Input data-testid="new-watchlist-input" />
			</Form.Item>
			<Form.Item
				name="existingWatchlistName"
				style={existingWatchlistStyle}
			>
				<Select data-testid="existing-watchlist-select" showSearch>
					{props.existingWatchlistNames.map((name) => (
						<Select.Option key={name} value={name}>
							{name}
						</Select.Option>
					))}
				</Select>
			</Form.Item>
		</Form>
	);
};

type WatchlistAndSave = [string, TaskTryT<DbWatchlist>];

const createOnOk =
	(
		symbol: string,
		dispatch: Dispatch,
		form: FormInstance<ModalFormData>,
		onClose: () => void
	): TaskT<void> =>
	(): Promise<void> => {
		const values: ModalFormData = form.getFieldsValue();
		const [watchlistName, saveAction]: WatchlistAndSave = match(values)
			.with(
				{ watchlistSelectionType: 'existing' },
				(_): WatchlistAndSave => [
					_.existingWatchlistName,
					addStockToWatchlist(_.existingWatchlistName, symbol)
				]
			)
			.otherwise(
				(_): WatchlistAndSave => [
					_.newWatchListName,
					createWatchlist(_.newWatchListName, symbol)
				]
			);
		return pipe(
			saveAction,
			TaskEither.fold(
				() => async () => constVoid(),
				() => async () => {
					dispatch(
						notificationSlice.actions.addSuccess(
							`Added ${symbol} to watchlist ${watchlistName}`
						)
					);
					return constVoid();
				}
			),
			Task.map(onClose)
		)();
	};

const isOkButtonDisabled = (form: FormInstance<ModalFormData>): boolean => {
	const formValues = form.getFieldsValue();
	return (
		((formValues.watchlistSelectionType === 'existing' ||
			formValues.watchlistSelectionType === undefined) &&
			!formValues.existingWatchlistName) ||
		(formValues.watchlistSelectionType === 'new' &&
			!formValues.newWatchListName)
	);
};

export const AddToWatchlistModal = (props: Props) => {
	const forceUpdate = useForceUpdate();
	const [form] = Form.useForm<ModalFormData>();
	const dispatch = useDispatch();
	const [state, setState] = useImmer<State>({
		loading: false,
		hadError: false,
		existingWatchlistNames: []
	});
	const getWatchlistNames = useMemo(
		() => createGetWatchlistNames(setState),
		[setState]
	);

	useEffect(() => {
		if (props.show) {
			getWatchlistNames();
		}
	}, [getWatchlistNames, props.show, form]);

	const Body = match(state)
		.with({ loading: true }, () => <Spinner />)
		.with({ loading: false, hadError: true }, () => (
			<Typography.Title className="ErrorMsg" level={3}>
				Error Loading Watchlist Names
			</Typography.Title>
		))
		.otherwise(() => (
			<ModalForm
				form={form}
				onFormChange={forceUpdate}
				existingWatchlistNames={state.existingWatchlistNames}
			/>
		));

	const onClose = () => {
		form.resetFields();
		props.onClose();
	};

	const onOk = createOnOk(props.symbol, dispatch, form, onClose);
	const okButtonDisabled = isOkButtonDisabled(form);

	return (
		<Modal
			title={`Add ${props.symbol} to Watchlist`}
			className="AddToWatchlistModal"
			data-testid="add-to-watchlist-modal"
			visible={props.show}
			onCancel={onClose}
			onOk={onOk}
			okButtonProps={{
				disabled: okButtonDisabled
			}}
		>
			{Body}
		</Modal>
	);
};
