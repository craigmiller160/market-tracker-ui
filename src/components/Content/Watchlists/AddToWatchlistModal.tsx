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
import { pipe } from 'fp-ts/es6/function';
import * as TaskEither from 'fp-ts/es6/TaskEither';
import { getWatchlistNames } from '../../../services/WatchlistService';
import { useEffect, useMemo } from 'react';
import { castDraft } from 'immer';
import { TaskT } from '@craigmiller160/ts-functions/es/types';
import { match } from 'ts-pattern';
import { Spinner } from '../../UI/Spinner';

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

const NewWatchlistItem = (
	<Form.Item shouldUpdate label="New">
		{(innerForm: FormInstance<ModalForm>) => (
			<Input
				disabled={
					innerForm.getFieldsValue().watchlistSelectionType !== 'new'
				}
				value={innerForm.getFieldsValue().newWatchListName}
				onChange={(event) =>
					innerForm.setFieldsValue({
						newWatchListName: event.target.value
					})
				}
			/>
		)}
	</Form.Item>
);

const createExistingWatchlistItem = (
	existingWatchlistNames: ReadonlyArray<string>
) => {
	const shouldUpdate = (
		oldValues: ModalForm,
		newValues: ModalForm
	): boolean =>
		oldValues.existingWatchlistName !== newValues.existingWatchlistName ||
		oldValues.watchlistSelectionType !== newValues.watchlistSelectionType;
	console.log('Creating');
	return (
		<Form.Item shouldUpdate={shouldUpdate} label="Existing">
			{(innerForm: FormInstance<ModalForm>) => {
				console.log('Updating');
				return (
					<Select
						value={innerForm.getFieldsValue().existingWatchlistName}
						onChange={(value) =>
							innerForm.setFieldsValue({
								existingWatchlistName: value
							})
						}
						disabled={
							innerForm.getFieldsValue()
								.watchlistSelectionType !== undefined &&
							innerForm.getFieldsValue()
								.watchlistSelectionType !== 'existing'
						}
					>
						{existingWatchlistNames.map((name) => (
							<Select.Option key={name} value={name}>
								{name}
							</Select.Option>
						))}
					</Select>
				);
			}}
		</Form.Item>
	);
};

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

const ModalForm = (props: ModalFormProps) => (
	<Form
		form={props.form}
		preserve
		initialValues={{
			watchlistSelectionType: 'existing'
		}}
	>
		<Form.Item name="watchlistSelectionType">
			<Radio.Group>
				<Space direction="vertical">
					<Radio value="existing">
						{createExistingWatchlistItem(
							props.existingWatchlistNames
						)}
					</Radio>
					<Radio value="new">{NewWatchlistItem}</Radio>
				</Space>
			</Radio.Group>
		</Form.Item>
	</Form>
);

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
