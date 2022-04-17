import {
	Form,
	FormInstance,
	Input,
	Modal,
	Radio,
	RadioChangeEvent,
	Select,
	Space,
	Typography
} from 'antd';
import { Updater, useImmer } from 'use-immer';
import { pipe } from 'fp-ts/es6/function';
import * as TaskEither from 'fp-ts/es6/TaskEither';
import { getWatchlistNames } from '../../../services/WatchlistService';
import { useEffect, useMemo } from 'react';
import { castDraft } from 'immer';
import { TaskT } from '@craigmiller160/ts-functions/es/types';
import { match } from 'ts-pattern';
import { Spinner } from '../../UI/Spinner';
import './AddToWatchlistModal.scss';

interface Props {
	readonly show: boolean;
	readonly onClose: () => void;
}

type WatchlistSelectionType = 'existing' | 'new';

interface ModalForm {
	readonly watchlistSelectionType: WatchlistSelectionType;
	readonly newWatchListName: string;
	readonly existingWatchlistName: string;
}

interface State {
	readonly loading: boolean;
	readonly hadError: boolean;
	readonly existingWatchlistNames: ReadonlyArray<string>;
}

// TODO don't forget alert message on success
// TODO make sure it resets when re-opened

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
	readonly form: FormInstance<ModalForm>;
	readonly existingWatchlistNames: ReadonlyArray<string>;
}

interface ModalFormState {
	readonly watchlistSelectionType: WatchlistSelectionType;
}

const ModalForm = (props: ModalFormProps) => {
	const [state, setState] = useImmer<ModalFormState>({
		watchlistSelectionType: 'existing'
	});

	const onSelectionTypeChange = (event: RadioChangeEvent) =>
		setState((draft) => {
			draft.watchlistSelectionType = event.target
				.value as WatchlistSelectionType;
		});

	const WatchlistField = match(state)
		.with({ watchlistSelectionType: 'existing' }, () => (
			<Form.Item name="existingWatchlistName">
				<Select>
					{props.existingWatchlistNames.map((name) => (
						<Select.Option key={name} value={name}>
							{name}
						</Select.Option>
					))}
				</Select>
			</Form.Item>
		))
		.otherwise(() => (
			<Form.Item name="newWatchlistName">
				<Input />
			</Form.Item>
		));

	return (
		<Form
			form={props.form}
			preserve
			initialValues={{
				watchlistSelectionType: state.watchlistSelectionType
			}}
		>
			<Form.Item name="watchlistSelectionType">
				<Radio.Group onChange={onSelectionTypeChange}>
					<Space direction="vertical">
						<Radio value="existing">Existing Watchlist</Radio>
						<Radio value="new">New Watchlist</Radio>
					</Space>
				</Radio.Group>
			</Form.Item>
			{WatchlistField}
		</Form>
	);
};

export const AddToWatchlistModal = (props: Props) => {
	const [form] = Form.useForm<ModalForm>();
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
			form.resetFields();
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
				existingWatchlistNames={state.existingWatchlistNames}
			/>
		));

	return (
		<Modal
			title="Add to Watchlist"
			className="AddToWatchlistModal"
			visible={props.show}
			onCancel={props.onClose}
		>
			{Body}
		</Modal>
	);
};
